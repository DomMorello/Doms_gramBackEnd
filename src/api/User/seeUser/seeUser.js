import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    seeUser: async (_, args) => {
      const { id } = args;
      const user = await prisma.user({ id });
      const posts = await prisma.user({ id }).posts();  //User가 올린 포스트를 가져온다. 
      return {
        user,
        posts
      };  //return으로 여러 가지를 할 수 있다.
    }
  }
};