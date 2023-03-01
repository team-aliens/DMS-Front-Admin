import styled from 'styled-components';

export function Divider() {
  return (
    <_Wrapper>
      <_Divider />
    </_Wrapper>
  );
}

const _Wrapper = styled.div`
  margin: 0 20px 0 40px;
`;

const _Divider = styled.hr`
  position: fixed;
  width: 1px;
  height: 500px;
  background-color: ${({ theme }) => theme.color.gray3};
  @media screen and (max-width: 1300px) {
    display: none;
  }
`;
