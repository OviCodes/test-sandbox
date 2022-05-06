import axios from "axios";
import { useRef, useReducer, useEffect } from "./use-labeled-hooks";

function useIsMounted() {
  const isMounted = useRef(true, { debugLabel: "isMounted" });
  useEffect(unsetMounted, [], {
    debugLabel: "[]"
  });

  return isMounted;

  function unsetMounted() {
    return () => (isMounted.current = false);
  }
}

export default function useFetchData() {
  const isMounted = useIsMounted();

  const [state, dispatch] = useReducer(
    (state, [actionType, actionPayload]) => {
      switch (actionType) {
        case "LOADING":
          return {
            ...state,
            isLoading: true,
            hasError: false
          };
        case "SUCCESS":
          return {
            ...state,
            isLoading: false,
            hasError: false,
            data: actionPayload
          };
        case "ERROR":
          return {
            ...state,
            isLoading: false,
            hasError: actionPayload
          };
        default:
          throw new Error();
      }
    },
    {
      isLoading: false,
      hasError: false,
      data: null
    },
    { debugLabel: "fetchReducer" }
  );

  async function fetchData(url) {
    dispatch(["LOADING"]);
    try {
      const result = await axios(url);
      if (isMounted.current) {
        dispatch(["SUCCESS", result.data]);
      }
    } catch (error) {
      if (isMounted.current) {
        dispatch(["ERROR", error.message]);
      }
    }
  }

  return [state, fetchData];
}
