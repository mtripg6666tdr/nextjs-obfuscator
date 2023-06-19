import { GitHubPageUrl } from "../constants";

export default function ExampleHeader(){
  return (
    <header style={{
      fontSize: "1.6rem",
      height: "3rem",
      lineHeight: "3rem",
      backgroundColor: "rgba(0, 0, 0, 0.15)",
    }}>
      <span>An example obfuscated Next.js app</span>
      <div style={{
        float: "right"
      }}>
        <a href={GitHubPageUrl} target="_blank" rel="noreferrer noopener">
          <span style={{marginRight: "1rem"}}>GitHub</span>
        </a>
      </div>
    </header>
  );
}
