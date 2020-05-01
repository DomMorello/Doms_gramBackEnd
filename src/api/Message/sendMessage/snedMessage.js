import { prisma } from "../../../../generated/prisma-client";
import { ROOM_FRAGMENT } from "../../../fragments";

export default {
  Mutation: {
    sendMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { roomId, message, toId } = args;
      let room;
      if (roomId === undefined) {   //room �� ���ٸ�
        if (user.id !== toId) { //�ڱ� �ڽ����� ������ ���� �ƴ϶��
          room = await prisma   
            .createRoom({
              participants: {
                connect: [{ id: toId }, { id: user.id }]
              }
            })
            .$fragment(ROOM_FRAGMENT);  //room�� ����� �� �ƾƵ�� �����»�� ���̵� (toId) �� �� �ȿ��� �����Ѵ�. participants �迭�� �ִ°�
        }
      } else {
        room = await prisma.room({ id: roomId }).$fragment(ROOM_FRAGMENT);  //room�� �̹� �ִٸ� �׳� fragment�� �߰��� ���·� ������ �ְ�
      }
      if (!room) {
        throw Error("Room not found");  //room�� null�̸� �����߻�
      }
      const getTo = room.participants.filter(
        participant => participant.id !== user.id   //������ filter�� �迭�� �����ϴµ� �Ƹ� 1��1�� ����ѵ�, �ű⼭ �ڱ� �ڽ��� ������ ���̵� ���´�. 
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
      });   //�ؽ�Ʈ�� �Է��� �޼����� ���ҿ��� �� �ڽ��� �����ϰ� to���� roomId�� �ִٸ�
            //�Ʊ� ���� �ڱ� �ڽ��� �ƴ� �������� ���̵�� �ϰ� roomId�� ������ �Է¹޴� toId�� �Ѵ�. 
    }
  }
};