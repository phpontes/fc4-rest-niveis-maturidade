//integrate with express-jwt
import { Router } from "express";
import { createDatabaseConnection } from "../database";
import jwt from "jsonwebtoken";
import cors from "cors";
import { defaultCorsOptions } from "../http/cors";
import { responseCached } from "../http/response-cached";
const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { userRepository } = await createDatabaseConnection();
  const user = await userRepository.findOne({
    where: {
      email: email as string,
      password: password as string,
    },
  });
  console.log(user);
  if (user) {
    //generate jwt token
    const token = jwt.sign({ sub: user.id }, "123", { expiresIn: "365d" });
    return res.send({ token });
  }

  res.status(401).send("Invalid email or password");
});

router.get(
  "/me",
  cors({
    ...defaultCorsOptions,
    methods: ["GET"],
  }),
  async (req, res) => {
    //@ts-expect-error
    const userId = req.userId;
    const { userRepository } = await createDatabaseConnection();
    const user = await userRepository.findOne({ where: { id: userId } });

    return responseCached(
      {
        res,
        body: user,
      },
      {
        maxAge: 60,
        type: "private",
        revalidate: "must-revalidate",
        //lastModified: user?.updatedAt,
      }
    );
  }
);

router.options(
  "/me",
  cors({
    ...defaultCorsOptions,
    methods: ["GET"],
  })
);

export default router;