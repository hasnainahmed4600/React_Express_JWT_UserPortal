export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['main'],
    role: ['ROLE_PROF_VIEW','ROLE_TARGET_VIEW','ROLE_CAT_VIEW', 'ROLE_LIC_VIEW']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Professionals',
    to: '/professionals',
    icon: 'cil-badge',
    role: ['ROLE_PROF_VIEW','ROLE_PROF_EDIT','ROLE_PROF_VIEW_DATA']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Patients',
    to: '/patients',
    icon: 'cil-people',
    role: ['ROLE_TARGET_VIEW','ROLE_TARGET_EDIT','ROLE_TARGET_VIEW_DATA']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Categories',
    to: '/categories',
    icon: 'cil-tags',
    role: ['ROLE_CAT_VIEW','ROLE_CAT_EDIT']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Licenses',
    to: '/licenses',
    icon: 'cil-task',
    role: ['ROLE_LIC_VIEW','ROLE_LIC_EDIT']
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['User and UserGroup'],
    role: ['ROLE_USER_VIEW','ROLE_USER_EDIT','ROLE_ROOM_VIEW','ROLE_ROOM_EDIT']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/users',
    icon: 'cil-people',
    role: ['ROLE_USER_VIEW','ROLE_USER_EDIT']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'User Group',
    to: '/usergroup',
    icon: 'cil-grid',
    role: ['ROLE_ROOM_VIEW','ROLE_ROOM_EDIT']
  },

  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2',
  }
]

