import archive from "./archive";

// Simple in-memory manager for items selected to be archived.
// Keeps two sets: students and faculty (by id). Exposes helpers to toggle
// selection, clear selections, get current selections and perform bulk
// archive/unarchive/delete operations via the archive helper.

const selected = {
  students: new Set(),
  faculty: new Set(),
};

function toggle(resource, id) {
  if (!selected[resource]) throw new Error(`Unknown resource: ${resource}`);
  if (selected[resource].has(id)) selected[resource].delete(id);
  else selected[resource].add(id);
}

function isSelected(resource, id) {
  return selected[resource] && selected[resource].has(id);
}

function clear(resource) {
  if (resource) {
    if (!selected[resource]) throw new Error(`Unknown resource: ${resource}`);
    selected[resource].clear();
  } else {
    selected.students.clear();
    selected.faculty.clear();
  }
}

function list(resource) {
  if (!selected[resource]) throw new Error(`Unknown resource: ${resource}`);
  return Array.from(selected[resource]);
}

async function bulkArchive(resource) {
  const ids = list(resource);
  // perform individual requests in sequence to keep it simple and observable
  const results = [];
  for (const id of ids) {
    // archive.archiveItem returns the response data
    // If an error is thrown, stop and rethrow after annotating which id failed.
    try {
      const res = await archive.archiveItem(resource, id);
      results.push({ id, res });
    } catch (err) {
      const e = new Error(`Failed to archive ${resource}/${id}: ${err.message}`);
      e.cause = err;
      throw e;
    }
  }
  // On success, clear the selection for that resource
  clear(resource);
  return results;
}

async function bulkUnarchive(resource) {
  const ids = list(resource);
  const results = [];
  for (const id of ids) {
    try {
      const res = await archive.unarchiveItem(resource, id);
      results.push({ id, res });
    } catch (err) {
      const e = new Error(`Failed to unarchive ${resource}/${id}: ${err.message}`);
      e.cause = err;
      throw e;
    }
  }
  clear(resource);
  return results;
}

async function bulkDelete(resource) {
  const ids = list(resource);
  const results = [];
  for (const id of ids) {
    try {
      const res = await archive.deleteArchived(resource, id);
      results.push({ id, res });
    } catch (err) {
      const e = new Error(`Failed to delete ${resource}/${id}: ${err.message}`);
      e.cause = err;
      throw e;
    }
  }
  clear(resource);
  return results;
}

export default {
  toggle,
  isSelected,
  clear,
  list,
  bulkArchive,
  bulkUnarchive,
  bulkDelete,
};
