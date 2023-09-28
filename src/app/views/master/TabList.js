import React from "react";
import { useLocation } from "react-router-dom";
import { Card } from "antd";

import { IssuerList } from "./issuer/issuerList";
import { RatingList } from "./rating/ratingList";
import { TenorList } from "./tenor/tenorList";
import { KepemilikanList } from "./kepemilikan/kepemilikanList";
import { PengelolaanList } from "./pengelolaan/pengelolaanList";
import { KategoriList } from "./kategori/kategoriList";

const useQuery = () => {
  let location = useLocation();
  return new URLSearchParams(location.search);
};

export function TabList() {
  const query = useQuery();
  const [tab, setTab] = React.useState(query.get("tab") || "bank");

  const onTabChange = (key) => {
    setTab(key);
  };

  const TabList = [
    {
      key: "bank",
      tab: "Bank",
    },
    {
      key: "rating",
      tab: "Bank Rating",
    },
    {
      key: "kategori",
      tab: "KBMI",
    },
    {
      key: "tenor",
      tab: "Tenor",
    },
    {
      key: "kepemilikan",
      tab: "Kepemilikan",
    },
    {
      key: "pengelolaan",
      tab: "Pengelolaan",
    },
  ];

  const contentList = {
    bank: <IssuerList />,
    rating: <RatingList />,
    kategori: <KategoriList />,
    tenor: <TenorList />,
    kepemilikan: <KepemilikanList />,
    pengelolaan: <PengelolaanList />,
  };

  return (
    <Card tabList={TabList} activeTabKey={tab} onTabChange={onTabChange}>
      {contentList[tab]}
    </Card>
  );
}
