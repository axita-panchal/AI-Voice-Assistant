"use client";

import { useState, useEffect } from "react";
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
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CallIcon from "@mui/icons-material/Call";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import {
  setActiveWorkspace,
  clearWorkspace,
} from "@/store/slices/workspaceSlice";
import { useAllWorkspaces } from "@/hooks/workspace/useWorkspaceQueries";
import { subAccountsType } from "@/types/workspace.types";
import Image from "next/image";
import MakeCallDrawer from "@/components/common/MakeCallDrawer";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "/assets/svgs/dashboard.svg",
  },
  { label: "Agent", href: "/agents", icon: "/assets/svgs/agent.svg" },
  { label: "Campaign", href: "/campaign", icon: "/assets/svgs/campaign.svg" },
  {
    label: "Contact List",
    href: "/contact-list",
    icon: "/assets/svgs/contacts.svg",
  },
  {
    label: "Recordings",
    href: "/recordings",
    icon: "/assets/svgs/recordings.svg",
  },
];

const EMPTY_SUBACCOUNTS: subAccountsType[] = [];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const activeWorkspace = useSelector(
    (state: RootState) => state.workspace.activeWorkspace,
  );

  const [page] = useState(0);
  const limit = 20;
  const skip = page * limit;

  const { data: allWorkspaces, isLoading } = useAllWorkspaces(skip, limit);

  const subaccounts =
    allWorkspaces?.data?.subaccounts ?? EMPTY_SUBACCOUNTS;

  useEffect(() => {
    if (!subaccounts || subaccounts.length === 0) {
      dispatch(clearWorkspace());
      localStorage.removeItem("activeWorkspace");
      return;
    }

     // If no active workspace OR active workspace was deleted
    const exists = subaccounts.some(
      (workspace: subAccountsType) => workspace.id === activeWorkspace?.id,
    );

    if (!activeWorkspace || !exists) {
      const firstWorkspace = subaccounts[0];

      dispatch(
        setActiveWorkspace({
          id: firstWorkspace.id,
          name: firstWorkspace.name,
        }),
      );

      localStorage.setItem("activeWorkspace", JSON.stringify(firstWorkspace));
    }
  }, [subaccounts, activeWorkspace, dispatch]);

  const isSmallScreen = useMediaQuery("(max-width:1000px)");
  const [open, setOpen] = useState(false);
  const [makeCallOpen, setMakeCallOpen] = useState(false);
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
    if (itemHref === "/agents") {
      return path === "/agents" || path.startsWith("/add-agent");
    }
    return path === itemHref;
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #E5E7EB",
          height: 72,
          justifyContent: "center",
        }}
      >
        <Toolbar
          sx={{
            height: 72,
            minHeight: "72px !important",
            px: { xs: 2, md: 8 },
            alignItems: "center",
          }}
          className="flex justify-between"
        >
          {/* LEFT SECTION */}
          <Box className="flex items-center gap-30">
            {isSmallScreen && (
              <IconButton onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            {!isSmallScreen && (
              <>
                {/* LOGO */}
                <Image
                  src="/assets/svgs/ai_voice.png"
                  alt="AI Voice"
                  className="cursor-pointer object-contain"
                  width={110}
                  height={32}
                  onClick={() => router.push("/dashboard")}
                />

                {/* NAVIGATION */}
                <nav className="flex items-center gap-2 whitespace-nowrap">
                  {NAV_ITEMS.map((item) => {
                    const isActive = isNavItemActive(
                      item.href,
                      pathname || "",
                    );

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-medium transition-all duration-200",
                          isActive
                            ? "bg-[#EEF3FF] text-[#3B82F6]"
                            : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]",
                        )}
                      >
                        <Image
                          src={item.icon}
                          alt={item.label}
                          height={20}
                          width={20}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </>
            )}
          </Box>

          {/* RIGHT SECTION */}
          <Box className="flex items-center gap-3">
           <Button
              fullWidth
              variant="contained"
              size="small"
              startIcon={<CallIcon sx={{ fontSize: 18 }} />}
              onClick={() => setMakeCallOpen(true)}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                bgcolor: "#2563eb",
                "&:hover": { bgcolor: "#1d4ed8" },
                px: { xs: 1, sm: 2 },
                whiteSpace: "nowrap",
              }}
              aria-label="Make a call"
            >
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                Make a call
              </Box>
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                Call
              </Box>
            </Button>
            {subaccounts?.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                  px: 1.5,
                  py: 0.75,
                  minWidth: 180,
                  maxWidth: 220,
                }}
              >
                <Image
                  src="/assets/svgs/subaccounts.svg"
                  alt="workspace"
                  width={16}
                  height={16}
                  style={{ marginRight: 8 }}
                />

                <Select
                  value={activeWorkspace?.id || ""}
                  variant="standard"
                  disableUnderline
                  disabled={isLoading}
                  onChange={(e) => {
                    const selected = subaccounts?.find(
                      (item: subAccountsType) => item.id === e.target.value,
                    );

                    if (selected) {
                      dispatch(
                        setActiveWorkspace({
                          id: selected.id,
                          name: selected.name,
                        }),
                      );

                      localStorage.setItem(
                        "activeWorkspace",
                        JSON.stringify(selected),
                      );
                    }
                  }}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#374151",

                    "& .MuiSelect-select": {
                      padding: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  }}
                  IconComponent={() => (
                    <Image
                      src="/assets/svgs/down_vector.svg"
                      alt="down_vector"
                      height={10}
                      width={10}
                    />
                  )}
                >
                  {subaccounts?.map((workspace: subAccountsType) => (
                    <MenuItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            )}

            {/* USER PROFILE */}
            <Box
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleUserClick}
            >
              <Avatar
                src="/assets/svgs/user_profile.svg"
                sx={{
                  width: 34,
                  height: 34,
                }}
              />

              <Image
                src="/assets/svgs/down_vector.svg"
                alt="down_vector"
                height={8}
                width={8}
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box className="w-65 p-4">
          <Box className="flex items-center gap-3 mb-6">
            <Image
              src="/assets/svgs/ai_voice.svg"
              className="rounded-lg"
              alt="ai_voice_logo"
              height={40}
              width={40}
            />

            <div>
              <p className="font-semibold">AI Voice</p>
              <p className="font-semibold">Assistant</p>
            </div>
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={<CallIcon />}
            onClick={() => {
              setOpen(false);
              setMakeCallOpen(true);
            }}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              bgcolor: "#2563eb",
              mb: 2,
              py: 1.25,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            Make a call
          </Button>

          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = isNavItemActive(item.href, pathname || "");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#EEF3FF] text-[#3B82F6]"
                      : "text-[#6B7280] hover:bg-[#F9FAFB]",
                  )}
                >
                  <Image
                    src={item.icon}
                    height={18}
                    width={18}
                    alt={item.label}
                  />

                  {item.label}
                </Link>
              );
            })}
          </nav>
        </Box>
      </Drawer>

      {/* PROFILE MENU */}
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
            mt: 1.5,
            borderRadius: "16px",
            minWidth: 260,
            p: 1,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          },
        }}
      >
        {/* PROFILE HEADER */}
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar src="/avatar.png" className="w-10! h-10!" />

          <div>
            <p className="text-base font-semibold leading-tight text-neutral-700">
              {user?.full_name}
            </p>

            <p className="text-sm text-[#909090]">{user?.email}</p>
          </div>
        </div>

        <Divider className="my-2!" />

        {/* Menu Items */}
        <MenuItem
          onClick={handleClose}
          sx={{ fontSize: "15px", color: "#565656", borderRadius: "10px" }}
        >
          <ListItemIcon>
            <Image
              src="/assets/svgs/userProfile.svg"
              alt="user_profile"
              height={20}
              width={20}
            />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem
          onClick={() => handleNavigate("/settings")}
          sx={{ fontSize: "15px", color: "#565656", borderRadius: "10px" }}
        >
          <ListItemIcon>
            <Image
              src="/assets/svgs/settings.svg"
              height={20}
              width={20}
              alt="settings"
            />
          </ListItemIcon>
          Settings
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          sx={{ fontSize: "15px", color: "#565656", borderRadius: "10px" }}
        >
          <ListItemIcon>
            <Image
              src="/assets/svgs/integration.svg"
              height={20}
              width={20}
              alt="integration"
            />
          </ListItemIcon>
          Integrations
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          sx={{ fontSize: "15px", color: "#565656", borderRadius: "10px" }}
        >
          <ListItemIcon>
            <Image
              src="/assets/svgs/billing.svg"
              height={20}
              width={20}
              alt="billing"
            />
          </ListItemIcon>
          Billing
        </MenuItem>

        <Divider className="my-2!" />

        <MenuItem
          onClick={() => {
            dispatch(logout());
            dispatch(clearWorkspace());
            localStorage.clear();
            router.push("/login");
          }}
          sx={{
            fontSize: "15px",
            color: "#DC2626",
            borderRadius: "10px",
          }}
        >
          <ListItemIcon>
            <Image
              src="/assets/svgs/logout.svg"
              height={20}
              width={20}
              alt="logout"
            />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>

      <MakeCallDrawer
        open={makeCallOpen}
        onClose={() => setMakeCallOpen(false)}
      />
    </>
  );
}