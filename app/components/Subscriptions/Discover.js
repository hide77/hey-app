import React from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'hey-i18n';

const Discover = styled.Text`
  height: 25px;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  line-height: 21px;
`;

const FollowedBy = styled.Text`
  height: 15px;
  color: #ffffff;
  font-size: 11px;
  line-height: 15px;
`;

const Gradient = styled(LinearGradient)`
  height: 54px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 28px;
  flex-direction: row;
`;

export default () => (
  <Gradient
    start={{x: 0.0, y: 0.75}}
    end={{x: 0.75, y: 1.0}}
    locations={[0, 1]}
    colors={['#4385ff', '#50d0df']}>
    <Discover>{I18n.t('Discover')}</Discover>
    <FollowedBy>{I18n.t('FollowedByYourNetwork')}</FollowedBy>
  </Gradient>
);
