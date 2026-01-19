import Image from "next/image";
import Link from "next/link";

const SeriesItem = ({ series, index }: { series: { slug: string, title: string }, index: number }) => {
  return (
    <article className="border border-black m-2.5 p-4">
      <Link href={`/series/${series.slug}`} className="block">
        <h1 className="text-2xl font-bold mb-2">{series.title}</h1>
      </Link>

      <Link href={`/series/${series.slug}`} className="block">
        <Image
          src="/assets/more.gif"
          alt="Read more"
          width={88}
          height={31}
          className="inline"
        />
      </Link>
    </article>
  );
};

export default SeriesItem;
