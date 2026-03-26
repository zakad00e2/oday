import Image, { type ImageLoaderProps, type ImageProps } from "next/image";

const passthroughLoader = ({ src }: ImageLoaderProps) => src;

type FlexibleImageProps = Omit<ImageProps, "src" | "loader"> & {
  src: string;
};

export default function FlexibleImage({
  src,
  alt,
  unoptimized,
  ...props
}: FlexibleImageProps) {
  const inferredBypass =
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("blob:") ||
    src.startsWith("data:");
  const shouldBypassOptimization = unoptimized ?? inferredBypass;

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      loader={shouldBypassOptimization ? passthroughLoader : undefined}
      unoptimized={shouldBypassOptimization}
    />
  );
}
