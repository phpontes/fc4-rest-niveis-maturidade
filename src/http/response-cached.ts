import { Response } from "express";
//import crypto from "crypto";

export function responseCached(
  restData: { res: Response; body: any },
  cacheData: {
    maxAge: number; //seconds
    type: "public" | "private";
    //immutable?: boolean;
    noCacheType?: "no-store" | "no-cache" | "both";
    revalidate: "must-revalidate" | "proxy-revalidate" | "no-revalidate";
  }
) {
  const { res, body } = restData;
  const {
    maxAge,
    type,
    //immutable = false,
    revalidate = "no-revalidate",
  } = cacheData;

  const bodyJson = "toJson" in body ? body.toJson() : body;
  //const bodyRaw = JSON.stringify(bodyJson);

  //   const hash = crypto.createHash("sha256").update(bodyRaw).digest("base64");

  //   if (res.req.headers["if-none-match"] === hash) {
  //     console.log("ETag hit");
  //     res.status(304).end(); // Not Modified
  //     return;
  //   }

  //   res.setHeader("ETag", hash);

  //const immutableFlag = immutable ? ", immutable" : "";

  const revalidateFlag =
    revalidate === "no-revalidate" ? "" : `, ${revalidate}`;

  let noCacheFlag = "";

  switch (cacheData.noCacheType) {
    case "no-store":
      noCacheFlag = ", no-store";
      break;
    case "no-cache":
      noCacheFlag = ", no-cache";
      break;
    case "both":
      noCacheFlag = ", no-store, no-cache";
      break;
  }

  res.setHeader(
    "Cache-Control",
    `${type}, max-age=${maxAge}${revalidateFlag}${noCacheFlag}`
  );

  //console.log("miss");
  res.send(bodyJson);
}