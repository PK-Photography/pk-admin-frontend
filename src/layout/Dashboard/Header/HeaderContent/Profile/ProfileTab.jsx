// import PropTypes from 'prop-types';
// import { useState } from 'react';

// // material-ui
// import List from '@mui/material/List';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';

// // assets
// import EditOutlined from '@ant-design/icons/EditOutlined';
// import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
// import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
// import UserOutlined from '@ant-design/icons/UserOutlined';
// import WalletOutlined from '@ant-design/icons/WalletOutlined';

// // ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

// export default function ProfileTab() {
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   const handleListItemClick = (index) => {
//     setSelectedIndex(index);
//   };

//   return (
//     <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
//       <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, '/apps/profiles/user/personal')}>
//         <ListItemIcon>
//           <EditOutlined />
//         </ListItemIcon>
//         <ListItemText primary="Edit Profile" />
//       </ListItemButton>
//       <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1, '/apps/profiles/account/basic')}>
//         <ListItemIcon>
//           <UserOutlined />
//         </ListItemIcon>
//         <ListItemText primary="View Profile" />
//       </ListItemButton>

//       <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3, 'apps/profiles/account/personal')}>
//         <ListItemIcon>
//           <ProfileOutlined />
//         </ListItemIcon>
//         <ListItemText primary="Social Profile" />
//       </ListItemButton>
//       <ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4, '/apps/invoice/details/1')}>
//         <ListItemIcon>
//           <WalletOutlined />
//         </ListItemIcon>
//         <ListItemText primary="Billing" />
//       </ListItemButton>
//       <ListItemButton selected={selectedIndex === 2}>
//         <ListItemIcon>
//           <LogoutOutlined />
//         </ListItemIcon>
//         <ListItemText primary="Logout" />
//       </ListItemButton>
//     </List>
//   );
// }

// ProfileTab.propTypes = { handleLogout: PropTypes.func };


import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axiosInstance from 'utils/axiosInstance';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/myprofile');
        setProfile(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const profileData = [
    { label: 'Employee ID', value: profile.employeeId },
    { label: 'Name', value: `${profile.firstName} ${profile.lastName}` },
    { label: 'Email', value: profile.email },
   
    { label: 'Department', value: profile.department.name },
    
  ];

  return (
    <Box>
      {/* <Typography variant="h6" sx={{ mb: 2 }}>
        Profile Details
      </Typography> */}
      <List component="nav" sx={{ p: 0 }}>
        {profileData.map((item, index) => (
          <ListItemButton
            key={index}
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(index)}
          >
            <ListItemText
              primary={item.label}
              secondary={item.value || 'N/A'}
              primaryTypographyProps={{ fontWeight: 'bold' }}
              secondaryTypographyProps={{ color: 'textSecondary' }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
