"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  MenuItem,
  Select,
  IconButton,
  Drawer,
  useMediaQuery,
  Menu,
  Divider,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "/assets/svgs/dashboard.svg",
  },
  { label: "Agent", href: "/agent", icon: "/assets/svgs/agent.svg" },
  { label: "Campaign", href: "/campaign", icon: "/assets/svgs/campaign.svg" },
  {
    label: "Contact List",
    href: "/contacts",
    icon: "/assets/svgs/contacts.svg",
  },
  {
    label: "Recordings",
    href: "/recordings",
    icon: "/assets/svgs/recordings.svg",
  },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state?.auth?.user);

  const isSmallScreen = useMediaQuery("(max-width:1000px)");
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const isNavItemActive = (itemHref: string, pathname: string) => {
    const path = pathname.replace(/\/$/, "");

    if (itemHref === "/agent") {
      return path === "/agent" || path.startsWith("/add-agent");
    }
    return path === itemHref;
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <AppBar
        position="sticky"
        elevation={0}
        className="border-b border-gray-200"
        sx={{
          backgroundColor: "#fff",
          height: 84,
          justifyContent: "center",
        }}
      >
        <Toolbar
          sx={{ height: 84, minHeight: 84 }}
          className="flex justify-between px-4"
        >
          {/* ========== LEFT SECTION ========== */}
          <Box className="flex items-center gap-4">
            {isSmallScreen && (
              <IconButton onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            {!isSmallScreen && (
              <>
                <img
                  src="/assets/svgs/ai_voice.svg"
                  alt="AI Voice"
                  className="w-10 h-10 rounded-lg"
                />

                <div className="flex flex-col leading-none">
                  <span className="font-medium text-gray-800 text-base">
                    AI Voice
                  </span>
                  <span className="font-medium text-gray-800 text-base">
                    Assistant
                  </span>
                </div>

                {/* NAVIGATION */}
                <nav className="flex gap-1 xl:gap-6 ">
                  {NAV_ITEMS.map((item) => {
                    const isActive = isNavItemActive(item.href, pathname || "");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition",
                          isActive
                            ? "text-[#2F6AFF] bg-[#2F6AFF1A]"
                            : "text-gray-500 hover:text-gray-900",
                        )}
                      >
                        <img src={item.icon} className="w-5 h-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </>
            )}
          </Box>

          {/* ========== RIGHT SECTION ========== */}
          <Box className="flex items-center gap-3">
            <Select
              size="small"
              defaultValue="sub1"
              sx={{
                height: 32,
                borderRadius: "8px",
                backgroundColor: "#7070701A",
                "& fieldset": { border: "none" },

                display: "flex",
                "@media (max-width:1050px)": {
                  display: "none",
                },
              }}
              renderValue={(selected) => (
                <Box className="flex items-center gap-2">
                  <img
                    src="/assets/svgs/user_account.svg"
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">
                    {selected === "sub1" ? "Subaccount 1" : "Subaccount 2"}
                  </span>
                </Box>
              )}
            >
              <MenuItem value="sub1">Subaccount 1</MenuItem>
              <MenuItem value="sub2">Subaccount 2</MenuItem>
            </Select>
            <Box
              className="flex items-center gap-1 cursor-pointer"
              onClick={handleUserClick}
            >
              <Avatar src="/assets/svgs/user_profile.svg" className="w-8 h-8" />
              <img src="/assets/svgs/down_vector.svg" className="w-2 h-2" />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ================= SIDEBAR ================= */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box className="w-65 p-4">
          <Box className="flex items-center gap-3 mb-6">
            <img
              src="/assets/svgs/ai_voice.svg"
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <p className="font-semibold">AI Voice</p>
              <p className="font-semibold">Assistant</p>
            </div>
          </Box>

          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = isNavItemActive(item.href, pathname || "");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-base",
                    isActive
                      ? "bg-[#2F6AFF1A] text-[#2F6AFF]"
                      : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  <img src={item.icon} className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </Box>
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "16px",
            minWidth: 260,
            p: 1,
          },
        }}
      >
        {/* Profile Header */}
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar src="/avatar.png" className="w-10! h-10!" />
          <div>
            <p className="text-lg font-semibold leading-tight text-neutral-700">
              {user?.full_name}
            </p>
            <p className="text-sm text-[#909090]">{user?.email}</p>
          </div>
        </div>

        <Divider className="my-2!" />

        {/* Menu Items */}
        <MenuItem
          onClick={handleClose}
          sx={{ fontSize: "16px", color: "#565656" }}
        >
          <ListItemIcon>
            <img src="/assets/svgs/userProfile.svg" className="w-5 h-5" />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem
          onClick={() => handleNavigate("/settings")}
          sx={{ fontSize: "16px", color: "#565656" }}
        >
          <ListItemIcon>
            <img src="/assets/svgs/settings.svg" className="w-5 h-5" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          sx={{ fontSize: "16px", color: "#565656" }}
        >
          <ListItemIcon>
            <img src="/assets/svgs/integration.svg" className="w-5 h-5" />
          </ListItemIcon>
          Integrations
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          sx={{ fontSize: "16px", color: "#565656" }}
        >
          <ListItemIcon>
            <img src="/assets/svgs/billing.svg" className="w-5 h-5" />
          </ListItemIcon>
          Billing
        </MenuItem>

        <Divider className="my-2!" />

        <MenuItem
          onClick={() => {
            dispatch(logout());
            localStorage.clear();
            handleClose();
            router.push("/login");
          }}
          className="text-red-600"
          sx={{ fontSize: "16px", color: "#565656" }}
        >
          <ListItemIcon className="text-red-600!">
            <img src="/assets/svgs/logout.svg" className="w-5 h-5" />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </>
  );
}
