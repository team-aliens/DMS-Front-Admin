import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { WithNavigatorBar } from '@/components/WithNavigatorBar';
import { pagePath } from '@/utils/pagePath';
import { useAvailAbleFeatures } from '@/hooks/useSchoolsApi';

export default function Index() {
  const { data: availableFeature } = useAvailAbleFeatures();

  return (
    <WithNavigatorBar>
      <Layout>
        {availableFeature?.study_room_service && (
          <Link to={pagePath.apply.studyRoom.list}>
            <_Wrapper>
              <Title>자습실</Title>
              <Text>
                자습실 관리와 생성 <br />
                또는 수정,삭제할 수 있습니다.
              </Text>
            </_Wrapper>
          </Link>
        )}
        {availableFeature?.remain_service && (
          <Link to={pagePath.apply.remains.list}>
            <_Wrapper>
              <Title>잔류</Title>
              <Text>
                잔류 항목 확인과 생성 <br /> 또는 수정,삭제할 수 있습니다.
              </Text>
            </_Wrapper>
          </Link>
        )}
      </Layout>
    </WithNavigatorBar>
  );
}
const Layout = styled.div`
  display: flex;
  margin: 260px auto auto;
  gap: 30px;
`;
const _Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 17px;
  padding-left: 40px;
  width: 500px;
  height: 200px;
  background: #ffffff;
  box-shadow: 0px 1px 20px rgba(238, 238, 238, 0.8);
  border-radius: 4px;
`;
const Title = styled.p`
  font-weight: 700;
  font-size: 22px;
`;
const Text = styled.p`
  width: 223px;
  font-weight: 400;
  font-size: 18px;
  line-height: 28px;
  color: #555555;
`;
