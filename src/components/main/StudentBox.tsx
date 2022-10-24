import styled from 'styled-components';
import { StudentInfo } from '@/apis/managers/response';

interface Props {
  studentInfo: StudentInfo;
  onClickStudent: (id: string) => void;
  isSelected: boolean;
}

export function StudentBox({ studentInfo, onClickStudent, isSelected }: Props) {
  return (
    <_Wrapper
      onClick={() => onClickStudent(studentInfo.id)}
      isSelected={isSelected}
    >
      <img src={studentInfo.profile_image_url} />
      <strong className="name">{studentInfo.name}</strong>
      <p className="gcn">{studentInfo.gcn}</p>
      <p className="roomNumber">{studentInfo.room_number}호</p>
    </_Wrapper>
  );
}

interface WrapperProps {
  isSelected: boolean;
}

const _Wrapper = styled.li<WrapperProps>`
  width: 100%;
  height: 70px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.color.primaryDarken2 : theme.color.gray1};
  box-shadow: 0 1px 20px rgba(204, 204, 204, 0.24);
  border-radius: 4px;
  padding: 17px 40px 17px 36px;
  display: flex;
  align-items: center;
  cursor: pointer;

  > img {
    width: 36px;
    height: 36px;
    background-color: ${({ theme, isSelected }) =>
      isSelected ? theme.color.primary : theme.color.gray5};
    border-radius: 50%;
  }

  > p,
  strong {
    font-size: ${({ theme }) => theme.textFont.l.size}px;
    font-weight: ${({ theme }) => theme.textFont.l.weight};
  }
  > .name {
    color: ${({ theme, isSelected }) =>
      isSelected ? theme.color.gray1 : theme.color.gray9};
    margin-left: 16px;
  }
  > .gcn {
    color: ${({ theme, isSelected }) =>
      isSelected ? theme.color.gray4 : theme.color.gray6};
    margin-left: 12px;
  }
  > .roomNumber {
    margin-left: auto;
    color: ${({ theme, isSelected }) =>
      isSelected ? theme.color.gray4 : theme.color.gray6};
  }
`;
