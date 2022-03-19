//https://memgraph.com/blog/cypher-cheat-sheet
const uri = process.env.VITE_VERCEL_URI;
const user = process.env.VITE_VERCEL_USER;
const password = process.env.VITE_VERCEL_PASSWORD;
import neo4j from "neo4j-driver";
import { devmode } from "../helpers";
export const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// Converts fields from a GET request to neo4j's dollar ($) placeholder format, e.g. { name: $name }
function toNeoProps(props = null, keys = []) {
  if (!props) throw new Error("properties passed to neo4j cannot be null!");
  // devmode && console.log("props", props);
  return JSON.stringify(
    Object.assign(
      ...Object.entries(props)?.map(([key, value]) => {
        return { [key]: `'${value || ""}'` };
      })
    )
  ).replace(/"/g, "");
}

//Execute Raw Queries here
export async function executeCypherQuery(statement, params = {}) {
  try {
    let session = driver.session();
    // devmode && console.log("!!session", !!session);
    const result = await session.run(statement, params);
    // devmode && console.log("!!result", !!result);
    // devmode && console.log("result", result);
    await session.close();
    return result;
  } catch (error) {
    console.log("error", error);
    // throw error; // we are logging this error at the time of calling this method
  }
}

export const toObjectFormat = (records = []) => {
  // devmode && console.log("records", records);
  return records?.map((r) => r["_fields"]?.map((r) => r?.properties)?.[0]);
};

/** Create A Node, update if exists, merge if not exactly matched  */
export async function createNode(label = null, page = {}, requiredFields = []) {
  if (!label) return ["Label cannot be null"];
  if (!requiredFields?.length) throw Error(`requiredFields cannot be null`);

  // devmode && console.log(`posting new ${label}...`);
  // console.log("requiredFields", requiredFields);
  let fields = toNeoProps(page, requiredFields); // maybe I don't need to exclude here... see session.run()'s params
  // devmode && console.log("fields", fields);

  // const conditions = `p.Title='${page?.Title}', p.Url='${page?.Url}'`;

  let query = `MERGE (p:${label} ${fields}) 
    ON CREATE
      SET p.created = timestamp()
    ON MATCH
      SET p.last_visited = timestamp()
  RETURN p`;

  console.log("query", query);
  const result = await executeCypherQuery(query, {
    ...fields,
  });

  const single = result?.records?.[0];
  const node = single?.get(0);

  devmode &&
    console.log(`node`, node?.properties?.name || "< no node created >");

  return node;
}

/**
   If there are any links, relate them to the papers of the same url and title
 *
 * @param {first props of first node} props1
 * @param {props of second node} props2
 * @param {name of relationship} relationshipType
 */
export async function createRelationship(pages = []) {
  const relTasks = pages.map((currentPage) => {
    const links = currentPage?.Links;
    const tasks = links.map((link) => {
      const rel = "LINKS_TO";
      const conditions = `{ Title: '${currentPage?.Title}', Url: '${currentPage?.Url}'}`;

      const query = `
        match (from: Page ${conditions})
        match (to: Page { Url: '${link}' } )
        merge (to)<-[:${rel}]-(from)
         `;

      return executeCypherQuery(query);
    });
    // Inner
    return Promise.all(tasks);
  });

  // Outer
  return await Promise.all(relTasks);

  // console.log("pages?.length (Relationships)", pages?.length);
  // for (let index = 0; index < pages.length; index++) {
  //   const currentPage = pages[index];
  //   // devmode && console.log("page", currentPage);
  //   const links = currentPage?.Links;

  //   // devmode && console.log("links", links);
  //   for (let index = 0; index < links.length; index++) {
  //     const link = links[index];

  //     const rel = "LINKS_TO";
  //     const conditions = `{ Title: '${currentPage?.Title}', Url: '${currentPage?.Url}'}`;
  //     // console.log("conditions", conditions);

  //     const query = `
  //     match (from: Page ${conditions})
  //     match (to: Page { Url: '${link}' } )
  //     merge (to)<-[:${rel}]-(from)
  //      `;

  //     // const query = `match (from: Page ${conditions}), (to)
  //     // ${whereClause}
  //     // merge (to)<-[:${rel}]-(from)
  //     //    `;

  //     console.log("query", query);

  //     await executeCypherQuery(query);
  //   }
  // }
}

export async function getRecords(label = null, limit = 35) {
  if (!label)
    return [
      `Nodes could not be found because you did not provide a label name`,
    ];

  let query = `MATCH (n:${label}) return n LIMIT ${limit}`;
  devmode && console.log("query", query);
  let results = await executeCypherQuery(query, {});
  console.log("results", results);
  return toObjectFormat(results?.records);
}

/** 
 * 
 * Other queries to implement
 * 
 * 
 
show all nodes w/ relationships
match (d)-[b]->(n)-[r]->(v) return d,b,n,r,v

show nodes w/o any single relationships
match ()-[b]-(n:Person)-[r]-(), (cc:Person) return n, type(b), type(r), cc




*/
