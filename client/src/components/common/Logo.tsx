interface Props { height?: number; }

export default function Logo({ height = 60 }: Props) {
  return <img src="/assets/logo-light-removebg.png" alt="Talksy" style={{ height }} />;
}
