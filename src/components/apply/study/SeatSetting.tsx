import {
  Escape,
  Text,
  DropDown,
  Input,
  Add,
  Button,
} from '@team-aliens/design-system';
import styled from 'styled-components';
import { ChangeEvent } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { SeatStatusType } from '@/apis/studyRooms/request';
import {
  SeatStatusKorean,
  seatStatusKoreanToEng,
  seatStatusToKorean,
} from '@/utils/translate';
import { SeatType } from '@/apis/studyRooms/response';
import { SelectedModalType } from '@/context/modal';
import { useStudyRoom } from '@/hooks/useStudyRoom';

const seatStatus = ['AVAILABLE', 'UNAVAILABLE', 'EMPTY'].map(
  (i: SeatStatusType) => seatStatusToKorean(i),
);

interface PropsType {
  seatTypeList: SeatType[];
  selectModal: (modal: SelectedModalType) => void;
  deleteSeatType: (id: string) => void;
  closeSeatSetting: () => void;
  addSeat: boolean;
}

export function SeatSetting({
  selectModal,
  seatTypeList,
  deleteSeatType,
  closeSeatSetting,
  addSeat,
}: PropsType) {
  const { studyRoomState, onChangeSeatSetting, confirmSetting } =
    useStudyRoom();
  const { status, type, number } = studyRoomState.seat;
  const onChangeSeatStatus = (changingStatus: SeatStatusKorean) => {
    onChangeSeatSetting({
      status: seatStatusKoreanToEng(changingStatus),
    });
  };
  const onChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeSeatSetting({
      number: e.target.valueAsNumber,
    });
  };

  return (
    <OutsideClickHandler onOutsideClick={!addSeat && closeSeatSetting}>
      <_Wrapper>
        <_EscapeWrapper onClick={closeSeatSetting}>
          <Escape size={24} />
        </_EscapeWrapper>
        <Text color="gray10" size="titleL" margin={['top', 50]}>
          자리 설정
        </Text>
        <DropDown
          items={seatStatus}
          placeholder="사용 가능"
          onChange={onChangeSeatStatus}
          label="자리 상태"
          value={seatStatusToKorean(studyRoomState.seat?.status)}
          margin={['top', 60]}
        />
        {seatStatusToKorean(studyRoomState.seat?.status) === '사용 가능' && (
          <Input
            label="자리 번호"
            type="number"
            placeholder="ex) 12 (숫자만 입력)"
            onChange={onChangeNumber}
            name="number"
            value={studyRoomState.seat?.number}
            margin={['top', 22]}
          />
        )}
        {status === 'AVAILABLE' && (
          <>
            <_SeatType>
              <Text color="gray6" size="bodyS" margin={['right', 'auto']}>
                자리 종류
              </Text>
              <button
                type="button"
                onClick={() => selectModal('ADD_SEAT_TYPE')}
              >
                <Add size={24} />
              </button>
            </_SeatType>
            <ul>
              {seatTypeList.map((item) => {
                const isSelected = studyRoomState.seat?.type?.id === item.id;
                return (
                  <_SeatTypeList
                    color={item.color}
                    isSelected={isSelected}
                    onClick={() => {
                      onChangeSeatSetting({
                        type: { ...item },
                      });
                    }}
                  >
                    <div className="color" />
                    <Text margin={['left', 12]} size="captionM">
                      {item.name}
                    </Text>
                    <Button
                      color="primary"
                      kind="text"
                      margin={['left', 'auto']}
                    >
                      {isSelected ? '취소' : '선택'}
                    </Button>
                    <Button
                      color="error"
                      kind="text"
                      margin={['left', 10]}
                      onClick={() => deleteSeatType(item.id)}
                    >
                      삭제
                    </Button>
                  </_SeatTypeList>
                );
              })}
            </ul>
          </>
        )}
        <_Buttons>
          <Button kind="outline" color="error" onClick={closeSeatSetting}>
            취소
          </Button>
          <Button
            disabled={
              !(
                (status === 'AVAILABLE' && type && number) ||
                (status === 'UNAVAILABLE' && number && !type) ||
                status === 'EMPTY'
              ) &&
              seatStatusToKorean(studyRoomState.seat?.status) !== '사용 불가'
            }
            kind="contained"
            color="primary"
            onClick={() => {
              confirmSetting();
              closeSeatSetting();
            }}
            margin={['left', 20]}
          >
            확인
          </Button>
        </_Buttons>
      </_Wrapper>
    </OutsideClickHandler>
  );
}

const _EscapeWrapper = styled.div`
  height: 24px;
  cursor: pointer;
`;

const _Wrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  padding: 40px 44px 30px 44px;
  top: 0;
  right: 0;
  width: 480px;
  height: 100%;
  z-index: 3;
  background-color: ${({ theme }) => theme.color.gray1};
  box-shadow: 0px 2px 20px 4px rgba(0, 0, 0, 0.16);
`;

const _SeatType = styled.div`
  display: flex;
  margin-top: 50px;
`;

const _SeatTypeList = styled.li<{
  color: string;
  isSelected?: boolean;
}>`
  margin-top: 15px;
  width: 100%;
  height: 44px;
  border-radius: 10px;
  display: flex;
  cursor: pointer;
  padding: 14px 0 14px 10px;
  align-items: center;
  background-color: ${({ isSelected, theme }) =>
    isSelected && theme.color.gray2};
  > .color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
  }
  > button {
    background-color: transparent;
  }
`;

const _Buttons = styled.div`
  display: flex;
  margin: 50px 0 0 auto;
`;
