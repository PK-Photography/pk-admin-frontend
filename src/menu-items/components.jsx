// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  DollarOutlined,
  RocketOutlined,
  LoadingOutlined,
  ReadOutlined,
  KeyOutlined,
  GlobalOutlined,
  FileDoneOutlined,
  NotificationOutlined,
  UsergroupAddOutlined,
  HomeOutlined,
  SolutionOutlined
} from '@ant-design/icons';

// icons
const icons = {
  RocketOutlined,
  DollarOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  ReadOutlined,
  KeyOutlined,
  GlobalOutlined,
  FileDoneOutlined,
  NotificationOutlined,
  UsergroupAddOutlined,
  HomeOutlined,
  SolutionOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //
<FileDoneOutlined />;

const components = {
  id: "components",
  title: "Components",
  type: "group",
  children: [
    {
      id: "clients",
      title: "Clients",
      type: "item",
      url: "/clients",
      icon: icons.DollarOutlined,
    },
    {
      id: "user-management",
      title: "User Management",
      type: "item",
      url: "/user-management",
      icon: icons.UsergroupAddOutlined,
    },
    {
      id: "manage-bookings",
      title: "Manage Bookings",
      type: "item",
      url: "/manage-bookings",
      icon: icons.RocketOutlined,
    },

    {
      id: "home-page-carousel",
      title: "Home Page Carousel",
      type: "item",
      url: "/home-page-carousel",
      icon: icons.HomeOutlined,
    },
    {
      id: "reviews",
      title: "Reviews",
      type: "item",
      url: "/reviews",
      icon: icons.GlobalOutlined,
    },
    {
      id: "manage-gallary",
      title: "Manage Gallary",
      type: "item",
      url: "/manage-gallary",
      icon: icons.BarcodeOutlined,
    },
    {
      id: "blogs",
      title: "Blogs",
      type: "item",
      url: "/blogs",
      icon: icons.ReadOutlined,
    },
    {
      id: "job-applications",
      title: "Job Applications",
      type: "item",
      url: "/jobApplication",
      icon: icons.SolutionOutlined,
    },
  ],
};

export default components;
