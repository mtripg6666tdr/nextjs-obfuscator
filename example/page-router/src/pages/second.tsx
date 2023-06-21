import Link from "next/link";
import SharedComponent from "../components/sharedComponent";

export default function SecondPage(){
  const style = {
    textAlign: "center" as const,
    fontSize: "1.4rem",
  };
  
  return (
    <div>
      <p style={style}>This is the 2nd test page!</p>
      <p style={style}>
        <SharedComponent />
        <Link href="/">
          <span>Return to top</span>
        </Link>
      </p>
    </div>
  )
}
