import Link from "next/link";
import { GitHubPageUrl } from "../constants";

export default function InjectDescription(){
  return (
    <>
    <p style={{
      textAlign: "center",
      fontSize: "1.4rem",
    }}>*This website is obfuscated by <a href={GitHubPageUrl}>nextjs-obfuscator</a> powered by javascript-obfuscator.</p>
    <Link href="/second">
      <a>Go to 2nd page.</a>
    </Link>
    </>
  )
}
