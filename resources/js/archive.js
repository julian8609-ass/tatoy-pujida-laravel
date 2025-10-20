import axios from "axios";

// Minimal archive helper for client-side use.
// All functions return a Promise and expect backend endpoints to exist.

export async function listArchived(resource) {
  // GET /api/{resource}/archived
  return axios.get(`/api/${resource}/archived`).then((r) => r.data);
}

export async function archiveItem(resource, id) {
  // POST /api/{resource}/{id}/archive
  return axios.post(`/api/${resource}/${id}/archive`).then((r) => r.data);
}

export async function unarchiveItem(resource, id) {
  // POST /api/{resource}/{id}/unarchive
  return axios.post(`/api/${resource}/${id}/unarchive`).then((r) => r.data);
}

export async function deleteArchived(resource, id) {
  // DELETE /api/{resource}/{id}
  return axios.delete(`/api/${resource}/${id}`).then((r) => r.data);
}

export default { listArchived, archiveItem, unarchiveItem, deleteArchived };
