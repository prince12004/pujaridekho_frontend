import { Breadcrumb } from "@/components/shared/breadcrumb";
import { AuthorByline } from "@/components/shared/author-byline";
import { PrevNextNav, type PrevNextItem } from "@/components/shared/prev-next-nav";
import { Container } from "@/components/shared/container";

export function BlogDetailContent({
  title,
  excerpt,
  category,
  coverImage,
  author,
  date,
  readTime,
  content,
  previous,
  next,
}: {
  title: string;
  excerpt?: string;
  category?: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  previous?: PrevNextItem;
  next?: PrevNextItem;
}) {
  return (
    <>
      <Container className="animate-fade-up font-heading pt-8 sm:pt-12">
        <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: title }]} className="mb-5" />

        {category && (
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            {category}
          </span>
        )}

        <h1 className="mt-3 max-w-4xl text-balance text-3xl leading-[1.15] font-bold text-secondary sm:text-4xl lg:text-[2.75rem] dark:text-brand-gold-soft">
          {title}
        </h1>

        {excerpt && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{excerpt}</p>}

        <div className="mt-6 border-b border-border pb-8">
          <AuthorByline name={author} role="Ritual Experts" date={date} readTime={readTime} />
        </div>
      </Container>

      <Container className="pt-8">
        <div
          className="animate-fade-scale group h-56 w-full overflow-hidden rounded-2xl border border-border shadow-lg sm:h-72 lg:h-[380px]"
          style={{ animationDelay: "100ms" }}
        >
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      </Container>

      <Container className="font-heading py-10">
        <div className="max-w-7xl animate-fade-up" style={{ animationDelay: "150ms" }}>
          <div className="prose-policy" dangerouslySetInnerHTML={{ __html: content }} />

          <PrevNextNav prev={previous} next={next} className="mt-12" />
        </div>
      </Container>
    </>
  );
}
