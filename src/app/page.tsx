"use client";

import { ForexRateData, ForexRateDataSample, ForexRateTablecolumns } from "@/types/forex-rate";
import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";

const apiUrl =
  process.env.NEXT_PUBLIC_FIXER_BASE_URL ||
  "https://api.apilayer.com/fixer/latest";
const apiKey = process.env.NEXT_PUBLIC_FIXER_API_KEY;

async function getForexRateData() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      apikey: apiKey as string,
    },
  };
  const response = await fetch(apiUrl, options);
  const data: ForexRateData = await response.json();
  return data;
}

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["forex-rate"],
    queryFn: getForexRateData,
  });

  if (isLoading) {
    return <div>loading data...</div>;
  }
  if (error) {
    return <div>error in fetching data</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }

  return (
    <div>
      <Table
        style={{ width: "50vw", padding: "2rem" }}
        dataSource={Object.entries(data.rates).map(([key, value], index) => ({
          key: index,
          currency: key,
          rate: value,
          added_rate: value + 10.0002,
          rounded_rate: Math.round(value),
        }))}
        columns={ForexRateTablecolumns}
        bordered={true}
      />
      ;
    </div>
  );
}
