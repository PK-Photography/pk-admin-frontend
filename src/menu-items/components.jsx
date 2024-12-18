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
      id: "employee-management",
      title: "Manage Employees",
      type: "item",
      url: "/employee-management",
      icon: icons.RocketOutlined,
    },
    {
      id: "manage-department",
      title: "Manage Department",
      type: "item",
      url: "/manage-department",
      icon: icons.DollarOutlined,
    },
    {
      id: "Attendance",
      title: "Attendance",
      type: "item",
      url: "/attendance",
      icon: icons.ReadOutlined,
    },
    {
      id: "employeesdeatails",
      title: "Employees Details",
      type: "item",
      url: "/employees-deatails",
      icon: icons.GlobalOutlined,
    },
    {
      id: "apply-leave",
      title: "Apply Leave",
      type: "item",
      url: "/apply-leave",
      icon: icons.KeyOutlined,
    },

    {
      id: "manage-leaves",
      title: "Manage Leaves",
      type: "item",
      url: "/manage-leaves",
      icon: icons.BarcodeOutlined,
    },


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
