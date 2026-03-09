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
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        width={420}
        p={3}
        display="flex"
        flexDirection="column"
        height="100%"
      >
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Stack
            display="flex"
            gap={2}
            flexDirection={"row"}
            alignItems="center"
          >
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

        {/* FORM */}
        <Box mt={3}>
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

        {/* CONTACTS */}
        <Box mt={3} flex={1} overflow="auto">
          <Typography fontWeight={500} mb={2}>
            Contact list
          </Typography>

          {allContactsData.map((contact) => (
            <Box
              key={contact.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={1.5}
              borderRadius={2}
              bgcolor="#F6F8FB"
              mb={1}
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

        {/* FOOTER */}
        <Box mt={2} display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ textTransform: "none" }}
          >
            Finish
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
