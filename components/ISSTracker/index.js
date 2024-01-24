import useSWR from "swr";
import Controls from "../Controls/index";
import Map from "../Map/index";
import { HelloMessage } from "./ISSTracker.styled";

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function ISSTracker() {
  const {
    data: coords,
    isLoading,
    error,
    mutate,
  } = useSWR("https://api.wheretheiss.at/v1/satellites/25544", fetcher, {
    refreshInterval: 5000,
  });

  if (error) return <div>failed to load</div>;
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
