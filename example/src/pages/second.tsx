import Link from "next/link";

export default function SecondPage(){
  const style = {
    textAlign: "center" as const,
    fontSize: "1.4rem",
  };
  
  return (
    <div>
      <p style={style}>This is the 2nd test page!</p>
      <p style={style}>
        <Link href="/">
          <span>Return to top</span>
        </Link>
      </p>
    </div>
  )
}
