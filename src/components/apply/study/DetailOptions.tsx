import styled from 'styled-components';
import {
  DropDown,
  SegmentedBtn,
  Input,
  Button,
} from '@team-aliens/design-system';
import React, { ChangeEvent, useState } from 'react';
import {
  GradeType,
  SexType,
  StudyRoomErrorMessage,
} from '@/apis/studyRooms/request';
import {
  gradeTypeToKorean,
  SexToKorean,
  sexTypeToKorean,
} from '@/utils/translate';
import { useModal } from '@/hooks/useModal';
import { SetUseTimeModal } from '@/components/modals/SetUseTime';

const sex = ['ALL', 'MALE', 'FEMALE'].map((i: SexType) => sexTypeToKorean(i));

const grade = [0, 1, 2, 3].map((i: GradeType) => gradeTypeToKorean(i));

interface PropsType {
  onChangeSegmented: (sex: SexToKorean) => void;
  onChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  west_description: string;
  east_description: string;
  north_description: string;
  south_description: string;
  available_grade: GradeType;
  available_sex: SexType;
  onChangeGrade: (grade: string & GradeType) => void;
  createStudyRoom: () => void;
  onChangeStudyTime: (time_id: string[]) => void;
  patch?: boolean;
  isCreateRoom: boolean;
  setTimeSlotId: (ids: string[]) => void;
  default_time_slots_id: string[];
  errorMessages: StudyRoomErrorMessage;
  errorChange: () => boolean;
}

export function CreateStudyRoomDetailOptions({
  onChangeSegmented,
  onChangeInput,
  west_description,
  east_description,
  north_description,
  south_description,
  available_sex,
  available_grade,
  onChangeGrade,
  onChangeStudyTime,
  createStudyRoom,
  isCreateRoom,
  setTimeSlotId,
  default_time_slots_id,
  errorMessages,
  errorChange,
}: PropsType) {
  const { modalState, selectModal, closeModal } = useModal();

  return (
    <_Wrapper>
      <SegmentedBtn
        selectedArr={sex}
        cur={sexTypeToKorean(available_sex)}
        onChange={onChangeSegmented}
      />
      <DropDown
        items={grade}
        placeholder="모든 학년"
        onChange={onChangeGrade}
        label="신청 가능 학년"
        value={gradeTypeToKorean(available_grade)}
        margin={['top', 20]}
      />
      <_ColumWrapper>
        <Input
          onChange={onChangeInput}
          name="east_description"
          value={east_description}
          placeholder="ex) 동쪽"
          width={160}
          errorMsg={errorMessages?.eastDescription}
          label="동쪽"
        />
        <Input
          onChange={onChangeInput}
          name="west_description"
          value={west_description}
          placeholder="ex) 서쪽"
          width={160}
          margin={['left', 10]}
          errorMsg={errorMessages?.westDescription}
          label="서쪽"
        />
      </_ColumWrapper>
      <_RowWrapper>
        <Input
          onChange={onChangeInput}
          name="south_description"
          value={south_description}
          placeholder="ex) 남쪽"
          width={160}
          errorMsg={errorMessages?.southDescription}
          label="남쪽"
        />
        <Input
          onChange={onChangeInput}
          name="north_description"
          value={north_description}
          placeholder="ex) 북쪽"
          width={160}
          margin={['left', 10]}
          errorMsg={errorMessages?.northDescription}
          label="북쪽"
        />
      </_RowWrapper>
      <Button
        color="primary"
        kind="contained"
        margin={[
          ['left', 'auto'],
          ['top', 'auto'],
        ]}
        onClick={() => {
          errorChange() ? selectModal('SET_STUDY_TIME') : '';
        }}
      >
        다음
      </Button>
      {modalState.selectedModal === 'SET_STUDY_TIME' && (
        <SetUseTimeModal
          setTimeSlotId={setTimeSlotId}
          isCreateRoom={isCreateRoom}
          close={closeModal}
          createStudyRoom={createStudyRoom}
          onChangeStudyTime={onChangeStudyTime}
          default_time_slots_id={default_time_slots_id}
        />
      )}
    </_Wrapper>
  );
}

const _Wrapper = styled.div`
  margin-left: 16px;
  display: flex;
  flex-direction: column;
`;
const _ColumWrapper = styled.div`
  display: flex;
  margin-top: 32px;
`;

const _RowWrapper = styled.div`
  display: flex;
  margin-top: 18px;
`;
