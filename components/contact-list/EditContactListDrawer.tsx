"use client";

import {
  Box,
  Button,
  Checkbox,
  Drawer,
  IconButton,
  TextField,
  Typography,
  Avatar,
  Stack,
  MenuItem,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  Contact,
  ContactList,
  UpdateContactListPayload,
} from "@/types/contact-list.types";
import Image from "next/image";
import { useCampaigns } from "@/hooks/campaign/useCampaignQueries";
import { Campaign } from "@/types/campaign.types";

interface Props {
  open: boolean;
  onClose: () => void;
  contactList?: ContactList;
  allContactsData: Contact[];
  onSubmit: (id: string, payload: UpdateContactListPayload) => void;
}

export default function EditContactListDrawer({
  open,
  onClose,
  contactList,
  allContactsData,
  onSubmit,
}: Props) {
  const [page] = useState(1);
  const limit = 20;
  const skip = (page - 1) * limit;
  const { data: campaignsData, isLoading: isPendingCampaign } = useCampaigns(
    limit,
    skip,
  );
  const [name, setName] = useState<string>("");
  const [campaign, setCampaign] = useState<string | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [originalContactIds, setOriginalContactIds] = useState<string[]>([]);

  // Initialize when editing
  useEffect(() => {
    if (contactList) {
      setName(contactList.name);
      setCampaign(contactList.campaign_id ?? "");

      const initialIds = contactList.contacts.map((c) => c.id);

      setSelectedContacts(initialIds);
      setOriginalContactIds(initialIds);
    }
  }, [contactList]);

  const handleToggle = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    if (!contactList) return;

    const add_contact_ids = selectedContacts.filter(
      (id) => !originalContactIds.includes(id),
    );

    const remove_contact_ids = originalContactIds.filter(
      (id) => !selectedContacts.includes(id),
    );

    const payload: UpdateContactListPayload = {
      name,
      campaign_id: campaign || null,
      add_contact_ids,
      remove_contact_ids,
    };

    onSubmit(contactList.id, payload);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
        },
      }}
    >
      <Box className="h-full flex flex-col">
        {/* ================= HEADER ================= */}
        <Box className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <Stack direction="row" alignItems="center" gap={2}>
            <Image
              src="/assets/svgs/edit_folder.svg"
              height={30}
              width={30}
              alt={"edit-folder"}
            />
            <Typography fontWeight={500}>Edit List</Typography>
          </Stack>

          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* ================= FORM (SCROLLABLE) ================= */}
        <Box className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <Box>
            <TextField
              fullWidth
              label="List name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Campaign"
              value={campaign ?? ""}
              onChange={(e) => setCampaign(e.target.value)}
              margin="normal"
              disabled={isPendingCampaign}
            >
              <MenuItem value="">
                <em>Select Campaign</em>
              </MenuItem>
              {campaignsData?.data?.data?.campaigns?.map((item: Campaign) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* ================= CONTACTS ================= */}
          <Box mt={3}>
            <Typography fontWeight={500} mb={2}>
              Contact list
            </Typography>

            {allContactsData.map((contact) => (
              <Box
                key={contact.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#F6F8FB] mb-2"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar />
                  <Box>
                    <Typography fontSize={14}>
                      {contact.first_name} {contact?.last_name}
                    </Typography>
                    <Typography fontSize={12} color="gray">
                      {contact.phone}
                    </Typography>
                  </Box>
                </Stack>

                <Checkbox
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => handleToggle(contact.id)}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* ================= FOOTER (STICKY) ================= */}
        <Box className="px-4 sm:px-6 py-4 bg-white flex flex-col sm:flex-row gap-2">
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{ textTransform: "none" }}
          >
            Finish
          </Button>

          <Button
            onClick={onClose}
            variant="outlined"
            fullWidth
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
