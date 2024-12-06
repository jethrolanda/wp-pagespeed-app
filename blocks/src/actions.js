export async function pageSpeed(urls) {
  try {
    const promises = urls.map(async (url) => {
      const report = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=mobile&category=accessibility&category=best-practices&category=performance&category=seo&key=AIzaSyBEQiaTL4wMnMCQA2WABjuIAOXLaL5LUo0`
      ).then((response) => {
        return response.json();
      });

      return {
        url,
        performance:
          report?.lighthouseResult?.categories?.performance?.score * 100,
        accessibility:
          report?.lighthouseResult?.categories?.accessibility?.score * 100,
        best_practices:
          report?.lighthouseResult?.categories?.["best-practices"]?.score * 100,
        seo: report?.lighthouseResult?.categories?.seo?.score * 100
      };
    });

    return await Promise.all(promises);
  } catch (error) {
    console.log(error);
  }
}

export async function getPages(url, params) {
  try {
    console.log(`${url}wp-json/wp/v2/pages${params}`);
    const response = await fetch(`${url}wp-json/wp/v2/pages${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    const urls = data.map((page) => page?.link); // eslint-disable-line no-use-before-define

    return {
      totalPages: response?.headers.get("x-wp-totalpages"),
      urls
    };

    // return { response, urls };
  } catch (error) {
    console.error(error);
  }
}
