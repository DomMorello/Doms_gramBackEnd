import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    editUser: (_, args, { request, isAuthenticated }) => {    //isAuthenticated �� context�� ������ import�� �� �ʿ䰡 ������.
      isAuthenticated(request);                                     //server.js ���Ͽ� isAutehnticated�� �߰��ؼ� ������.
      const { username, email, firstName, lastName, bio } = args;
      const { user } = request;
      return prisma.updateUser({
        where: { id: user.id },
        data: { username, email, firstName, lastName, bio },
      });
    },
  },
};
