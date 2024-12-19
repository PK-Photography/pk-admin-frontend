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
} from "@ant-design/icons";

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
      icon: icons.ReadOutlined,
    },
    {
      id: "reviews",
      title: "Reviews",
      type: "item",
      url: "/reviews",
      icon: icons.GlobalOutlined,
    },
    // {
    //   id: "apply-leave",
    //   title: "Apply Leave",
    //   type: "item",
    //   url: "/apply-leave",
    //   icon: icons.KeyOutlined,
    // },

    // {
    //   id: "manage-leaves",
    //   title: "Manage Leaves",
    //   type: "item",
    //   url: "/manage-leaves",
    //   icon: icons.BarcodeOutlined,
    // },


    // {
    //   id: "admincard",
    //   title: "Admit Card",
    //   type: "item",
    //   url: "/admincard",
    //   icon: icons.FileDoneOutlined,
    // },
    // {
    //   id: "contactUs",
    //   title: "Contact Us",
    //   type: "item",
    //   url: "/contact",
    //   icon: icons.FileDoneOutlined,
    // },

    // {
    //   id: "notification",
    //   title: "Notification",
    //   type: "item",
    //   url: "/notification",
    //   icon: icons.NotificationOutlined,
    // },
    // {
    //   id: "highlight",
    //   title: "Card Highlights ",
    //   type: "item",
    //   url: "/highlight",
    //   icon: icons.ReadOutlined,
    // },
    // {
    //   id: "banner",
    //   title: "Banners ",
    //   type: "item",
    //   url: "/banner",
    //   icon: icons.ReadOutlined,
    // },
    // {
    //   id: "faqs",
    //   title: "FAQs ",
    //   type: "item",
    //   url: "/faqs",
    //   icon: icons.ReadOutlined,
    // },
    // {
    //   id: "common",
    //   title: "common",
    //   type: "item",
    //   url: "/common",
    //   icon: icons.BarcodeOutlined,
    // },
  ],
};

export default components;
