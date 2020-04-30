import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    editUser: (_, args, { request, isAuthenticated }) => {    //isAuthenticated 를 context로 넣으면 import를 할 필요가 없어짐.
      isAuthenticated(request);                                     //server.js 파일에 isAutehnticated를 추가해서 가능함.
      const { username, email, firstName, lastName, bio } = args;
      const { user } = request;
      return prisma.updateUser({
        where: { id: user.id },
        data: { username, email, firstName, lastName, bio },
      });
    },
  },
};
