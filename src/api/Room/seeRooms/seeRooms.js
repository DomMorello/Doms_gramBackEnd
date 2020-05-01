import { prisma } from "../../../../generated/prisma-client";
import { ROOM_FRAGMENT } from "../../../fragments";

export default {
  Query: {
    seeRooms: (_, __, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      return prisma
        .rooms({
          where: {
            participants_some: {
              id: user.id,
            },
          },
        })
        .$fragment(ROOM_FRAGMENT);  //사용자가 참가하고 있는 모든 룸을 보여줘라 
    },
  },
};
