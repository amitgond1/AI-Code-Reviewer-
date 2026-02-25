import axios from "axios";

const SUPPORTED_EXTENSIONS = [".py", ".js", ".cpp", ".c", ".java", ".txt"];
const MAX_FILES = 20;
const MAX_FILE_SIZE = 150_000;

const parseRepo = (url) => {
  const match = url.match(/github\.com\/(.+?)\/(.+?)(?:\.git|\/|$)/i);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
};

const isSupported = (name) => SUPPORTED_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext));

const fetchTree = async (owner, repo) => {
  const headers = {
    Accept: "application/vnd.github+json"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const branch = process.env.GITHUB_DEFAULT_BRANCH || "main";
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

  try {
    const response = await axios.get(url, { headers });
    return response.data.tree || [];
  } catch {
    const fallbackUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`;
    const response = await axios.get(fallbackUrl, { headers });
    return response.data.tree || [];
  }
};

const fetchRawFile = async (owner, repo, path) => {
  const branch = process.env.GITHUB_DEFAULT_BRANCH || "main";
  const tryUrls = [
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`,
    `https://raw.githubusercontent.com/${owner}/${repo}/master/${path}`
  ];

  for (const url of tryUrls) {
    try {
      const response = await axios.get(url, { timeout: 10000, responseType: "text" });
      return response.data;
    } catch {
      continue;
    }
  }

  return "";
};

export const fetchGithubRepoCode = async (repoUrl) => {
  const parsed = parseRepo(repoUrl);
  if (!parsed) {
    throw new Error("Invalid GitHub repository URL");
  }

  const tree = await fetchTree(parsed.owner, parsed.repo);
  const candidates = tree
    .filter((item) => item.type === "blob" && isSupported(item.path) && item.size <= MAX_FILE_SIZE)
    .slice(0, MAX_FILES);

  if (!candidates.length) {
    throw new Error("No supported code files found in repository");
  }

  const fileChunks = [];
  for (const file of candidates) {
    const content = await fetchRawFile(parsed.owner, parsed.repo, file.path);
    if (content.trim().length) {
      fileChunks.push(`// FILE: ${file.path}\n${content}`);
    }
  }

  if (!fileChunks.length) {
    throw new Error("Unable to fetch repository files");
  }

  return {
    code: fileChunks.join("\n\n"),
    fileName: `${parsed.owner}/${parsed.repo}`,
    language: "mixed"
  };
};
