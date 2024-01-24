import useSWR from "swr";
import Controls from "../Controls/index";
import Map from "../Map/index";
import { HelloMessage } from "./ISSTracker.styled";
import styled from "styled-components";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An Error occurred while fetching !!!");
    console.log(error);
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function ISSTracker() {
  const {
    data: coords,
    isLoading,
    error,
    mutate,
  } = useSWR("https://api.wheretheiss.at/v1/satellites/25544", fetcher, {
    refreshInterval: 5000,
  });

  if (error) return <StyledError>{error.message.toUpperCase()}</StyledError>;
  if (isLoading)
    return (
      <div>
        <span> 🔄 </span>loading...
      </div>
    );

  return (
    <main>
      <Map longitude={coords.longitude} latitude={coords.latitude} />
      <Controls
        longitude={coords.longitude}
        latitude={coords.latitude}
        onRefresh={() => mutate()}
      />
      <HelloMessage>
        You are seeing the actual position of {coords.name.toUpperCase()}{" "}
      </HelloMessage>
    </main>
  );
}

const StyledError = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  color: red;
  font-size: 2rem;
`;
