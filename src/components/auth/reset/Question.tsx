import styled from 'styled-components';
import { Text } from '@team-aliens/design-system';

interface PropsType {
  question: string;
}

export function Question({ question }: PropsType) {
  return (
    <_QuestionWrapper>
      <Text display="block" size="bodyS" margin={['bottom', 8]}>
        학교 인증 질문
      </Text>
      <Text size="bodyM" color="gray6">
        {question}
      </Text>
    </_QuestionWrapper>
  );
}

const _QuestionWrapper = styled.div`
  margin: 16px 0 40px 0;
  padding: 12px 16px;
  height: 70px;
  background-color: ${({ theme }) => theme.color.gray2};
`;
