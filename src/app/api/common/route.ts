import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

// import redis from '@/lib/redis';
import moment from "moment";
import { checkNum } from "@/lib/helper";

export async function POST(req, { params }) {
  const Inputdata = await req.json();

  try {
    const { mdl, ...restData } = Inputdata;
    const collection = await mongoose.connection.db.collection(mdl);

    // Transform the data
    const transformedData = Object.entries(restData).reduce(
      (acc, [key, value]) => {
        acc[key] = checkNum(value) ? parseInt(value) : value;
        return acc;
      },
      {}
    );
    (transformedData["createdAt"] = moment().format("YYYY-MM-DD HH:mm:ss")),
      (transformedData["updatedAt"] = moment().format("YYYY-MM-DD HH:mm:ss")),
      console.log("transformedData", transformedData);
    const result = await collection.insertOne(transformedData);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    let url = new URL(req.url)?.searchParams;
    let searchParamsData = new URLSearchParams(url);
    let query = {};

    if (searchParamsData) {
      for (const key of searchParamsData?.keys()) {
        if (key !== "mdl") {
          query[key] =
            checkNum(searchParamsData.get(key)) &&
            !searchParamsData.get(key)?.includes("/")
              ? parseInt(searchParamsData.get(key))
              : searchParamsData.get(key);
        }
      }
    }

    let model = searchParamsData.get("mdl");
    let queryString = JSON.stringify(query);
    // let cacheKey = `${model}:${queryString}`;

    // // Check if the data is in the cache
    // let cachedData =
    //   model !== "userDataFinal" &&
    //   model !== "userData" &&
    //   model !== "TransactionHistory"; //&&
    // // (await redis.get(cacheKey));

    // if (cachedData) {
    //   // console.log("cachedData","cachedData")
    //   // Return cached data
    //   return new Response(cachedData, {
    //     status: 200,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    // }
    // else {
    let collection = await mongoose.connection.db.collection(model);
    let withoutModel = await collection.find(query).toArray();

    // Cache the result
    // model !== "userDataFinal" &&
    //   model !== "userData" &&
    //   model !== "TransactionHistory" //&&
    // (await redis.set(cacheKey, JSON.stringify(withoutModel), "EX", 36000)); // Cache for 1 hour
    //  console.log("cachedDataAPI",withoutModel)
    return new Response(JSON.stringify(withoutModel), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
export async function PUT(req, { params }) {
  const Inputdata = await req.json();
  console.log("posttt", Inputdata);
  try {
    const { mdl, condtn = {}, ...restData } = Inputdata;
    const collection = await mongoose.connection.db.collection(mdl);

    // Transform the data
    const query = Object.entries(restData).reduce((acc, [key, value]) => {
      if (key !== "mdl" && key !== "condtn" && key !== "_id") {
        acc[key] = checkNum(value) ? parseInt(value) : value;
      }
      return acc;
    }, {});

    console.log("src", query);
    query["updatedAt"] = moment().format("YYYY-MM-DD HH:mm:ss");
    const result = await collection.updateOne(
      { ...condtn },
      { $set: query },
      { upsert: true }
    );

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function DELETE(req, { params }) {
  const Inputdata = await req.json();

  try {
    const { mdl, condition } = Inputdata;
    const collection = await mongoose.connection.db.collection(mdl);

    const result = await collection.deleteMany({ ...condition });
    console.log("Deleted documents count:", result.deletedCount);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
