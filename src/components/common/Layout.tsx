import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { SplitLayout, SplitCol } from '@vkontakte/vkui';

export const Layout = () => {
  return (
    <>
    <Header/>
    <Outlet />
    </>
  );
};