import { BreadCrumb } from '@team-aliens/design-system';
import { StudyRoom } from '@team-aliens/design-system/dist/components/studyRoom';
import styled from 'styled-components';
import { useState } from 'react';
import { CreateStudyRoomOptions } from '@/components/apply/CreateOptions';
import { WithNavigatorBar } from '@/components/WithNavigatorBar';
import { CreateStudyRoomDetailOptions } from '@/components/apply/DetailOptions';
import { useModal } from '@/hooks/useModal';
import { SeatSetting } from '@/components/apply/SeatSetting';
import {
  useCreateStudyRoom,
  useDeleteSeatType,
  useSeatTypeList,
} from '@/apis/studyRooms';
import { AddSeatType } from '@/components/modals/AddSeatType';
import { useStudyRoom } from '@/hooks/useStudyRoom';
import { Seat } from '@/apis/studyRooms/request';

const pathToKorean = {
  apply: '신청',
};

export function CreateRoom() {
  const [seatSetting, setSeatSetting] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const { selectModal, modalState, closeModal } = useModal();

  const {
    studyRoomState,
    onChangeGrade,
    onChangeInput,
    onChangeSex,
    onChangeSeatSetting,
  } = useStudyRoom();

  const {
    name, floor, total_height_size, total_width_size, ...rest
  } =
    studyRoomState;

  const { seat, ...creatStudyRoomRequest } = studyRoomState;

  const { data: seatTypeList, refetch: refetchTypeList } = useSeatTypeList();

  const createStudyRoom = useCreateStudyRoom({
    ...creatStudyRoomRequest,
    seats: creatStudyRoomRequest.seats.map((i): Seat => ({
      width_location: i.width_location,
      height_location: i.height_location,
      number: i.number,
      status: i.status,
      type_id: i.type.id,
    })),
  });

  const closeSeatSetting = () => {
    setSeatSetting(false);
  };

  const deleteType = useDeleteSeatType(deleteId, {
    onSuccess: () => refetchTypeList(),
  });

  const deleteSeatType = async (id: string) => {
    await setDeleteId(id);
    deleteType.mutate();
  };

  const onChangeSelectedPosition = (x: number, y: number) => {
    setSeatSetting(true);
    onChangeSeatSetting({
      width_location: x,
      height_location: y,
    });
  };
  return (
    <WithNavigatorBar>
      {modalState.selectedModal === 'ADD_SEAT_TYPE' && (
        <AddSeatType
          closeModal={closeModal}
          refetchTypeList={refetchTypeList}
        />
      )}
      {seatSetting && (
        <SeatSetting
          selectModal={selectModal}
          seatTypeList={seatTypeList?.types || []}
          deleteSeatType={deleteSeatType}
          closeSeatSetting={closeSeatSetting}
        />
      )}
      <_Wrapper>
        <BreadCrumb pathToKorean={pathToKorean} />
        <CreateStudyRoomOptions
          onChange={onChangeInput}
          floor={floor}
          name={name}
          total_width_size={total_width_size}
          total_height_size={total_height_size}
        />
        <_Body>
          <StudyRoom
            {...rest}
            seats={studyRoomState.seats.map((i) => ({
              ...i,
              student: null,
            }))}
            isEdit
            selectedPosition={{
              x: studyRoomState.seat.width_location,
              y: studyRoomState.seat.height_location,
            }}
            onClickSeat={onChangeSelectedPosition}
            total_width_size={total_width_size}
            total_height_size={total_height_size}
          />
          <CreateStudyRoomDetailOptions
            onChangeSegmented={onChangeSex}
            onChangeInput={onChangeInput}
            onChangeGrade={onChangeGrade}
            createStudyRoom={createStudyRoom.mutate}
            {...rest}
          />
        </_Body>
      </_Wrapper>
    </WithNavigatorBar>
  );
}

const _Wrapper = styled.section`
  width: 1040px;
  margin: 0 auto;
  padding-top: 86px;
`;

const _Body = styled.div`
  display: flex;
  margin-top: 78px;
`;
