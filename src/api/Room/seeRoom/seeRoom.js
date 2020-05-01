import { prisma } from "../../../../generated/prisma-client";
import { ROOM_FRAGMENT } from "../../../fragments";

export default {
  Query: {
    seeRoom: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id } = args;
      const { user } = request;
      const canSee = await prisma.$exists.room({    //사용자가 참여하는 룸이 존재하는지 여부
        participants_some: {
          id: user.id
        }
      });
      if (canSee) {
        return prisma.room({ id }).$fragment(ROOM_FRAGMENT);    //그런 룸이 있으면 조회해라
      } else {
        throw Error("You can't see this");
      }
    }
  }
};