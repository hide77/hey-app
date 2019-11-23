import React from 'react';
import styled from 'styled-components/native';

const ImgSize = 42;

const Img = styled.Image`
  height: 64px;
  width: 64px;
  ${props => props.menu && `
    height: ${ImgSize};
    width: ${ImgSize};
    borderRadius: ${ImgSize/2};
    shadow-color: #bb0e0e;
    shadow-opacity: 0.09;
    shadow-radius: 14px;
  `}
  ${props => props.off && `
    border-width: 0px;
    border-color: #C5CDDC;
  `}
  ${props => props.mini && `height: 14px; width: 14px;`}
  ${props => props.btnImg && `height: 50px; width: 50px; margin-right: 8px;`}
  ${props => props.btnImgMini && `height: 20px; width: 20px; margin-left: 10px;`}
`;

export default {
  'blu-circle': <Img resizeMode="contain" source={require('hey/img/blu-circle.png')} />,
  'coin': <Img btnImg resizeMode="contain" source={require('hey/img/coin.png')} />,
  'heart-red': <Img resizeMode="contain" source={require('hey/img/heart-red.png')} />,
  'heart-white': <Img resizeMode="contain" source={require('hey/img/heart-white.png')} />,
  'menu-chat-off': <Img menu off resizeMode="contain" source={require('hey/img/menu-chat-off.png')} />,
  'menu-chat-on': <Img menu resizeMode="contain" source={require('hey/img/menu-chat-on.png')} />,
  'menu-feed-off': <Img menu off resizeMode="contain" source={require('hey/img/menu-feed-off.png')} />,
  'menu-feed-on': <Img menu resizeMode="contain" source={require('hey/img/menu-feed-on.png')} />,
  'menu-not-off': <Img menu off resizeMode="contain" source={require('hey/img/menu-not-off.png')} />,
  'menu-not-on': <Img menu resizeMode="contain" source={require('hey/img/menu-not-on.png')} />,
  'menu-profile-off': <Img menu off resizeMode="contain" source={require('hey/img/menu-profile-off.png')} />,
  'menu-profile-on': <Img menu resizeMode="contain" source={require('hey/img/menu-profile-on.png')} />,
  'menu-sub-off': <Img menu off resizeMode="contain" source={require('hey/img/menu-sub-off.png')} />,
  'menu-sub-on': <Img menu resizeMode="contain" source={require('hey/img/menu-sub-on.png')} />,
  'plus-grey': <Img resizeMode="contain" source={require('hey/img/plus-grey.png')} />,
  'plus-white': <Img resizeMode="contain" source={require('hey/img/plus-white.png')} />,
  'search-grey': <Img resizeMode="contain" source={require('hey/img/search-grey.png')} />,
  'sneaky-blu': <Img resizeMode="contain" source={require('hey/img/sneaky-blu.png')} />,
  'invite': <Img btnImgMini resizeMode="contain" source={require('hey/img/invite.png')} />,
  'rank-1': <Img mini resizeMode="contain" source={require('hey/img/ranks/rank-1.png')} />,
  'rank-2': <Img mini resizeMode="contain" source={require('hey/img/ranks/rank-2.png')} />,
  'rank-3': <Img mini resizeMode="contain" source={require('hey/img/ranks/rank-3.png')} />,
  'rank-4': <Img mini resizeMode="contain" source={require('hey/img/ranks/rank-4.png')} />,
  'rank-5': <Img mini resizeMode="contain" source={require('hey/img/ranks/rank-5.png')} />,
  'rank-6': <Img mini resizeMode="contain" source={require('hey/img/ranks/rank-6.png')} />,
};
