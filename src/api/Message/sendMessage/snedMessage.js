import { prisma } from "../../../../generated/prisma-client";
import { ROOM_FRAGMENT } from "../../../fragments";

export default {
  Mutation: {
    sendMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { roomId, message, toId } = args;
      let room;
      if (roomId === undefined) {   //room 이 없다면
        if (user.id !== toId) { //자기 자신한테 보내는 것이 아니라면
          room = await prisma   
            .createRoom({
              participants: {
                connect: [{ id: toId }, { id: user.id }]
              }
            })
            .$fragment(ROOM_FRAGMENT);  //room을 만들고 내 아아디와 보내는사람 아이디 (toId) 를 방 안에서 연결한다. participants 배열에 넣는것
        }
      } else {
        room = await prisma.room({ id: roomId }).$fragment(ROOM_FRAGMENT);  //room이 이미 있다면 그냥 fragment만 추가한 상태로 가만히 있고
      }
      if (!room) {
        throw Error("Room not found");  //room이 null이면 에러발생
      }
      const getTo = room.participants.filter(
        participant => participant.id !== user.id   //참가자 filter로 배열을 리턴하는데 아마 1대1만 고려한듯, 거기서 자기 자신을 제외한 아이디를 얻어온다. 
      )[0];
      return prisma.createMessage({
        text: message,
        from: {
          connect: { id: user.id }
        },
        to: {
          connect: {
            id: roomId ? getTo.id : toId
          }
        },
        room: {
          connect: {
            id: room.id
          }
        }
      });   //텍스트는 입력한 메세지고 프롬에는 나 자신을 연결하고 to에는 roomId가 있다면
            //아까 얻은 자기 자신이 아닌 참가자의 아이디로 하고 roomId가 없으면 입력받는 toId로 한다. 
    }
  }
};