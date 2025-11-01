import axiosClient from "./axiosClient";

const filterApi = {
  getFilterOptions: () => axiosClient.get("/events/filters"),
};

export default filterApi;
