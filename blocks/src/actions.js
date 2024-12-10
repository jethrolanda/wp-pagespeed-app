export async function pageSpeed(urls, params) {
  try {
    const promises = urls.map(async (url) => {
      const report = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&${params}&key=AIzaSyBEQiaTL4wMnMCQA2WABjuIAOXLaL5LUo0`
      ).then((response) => {
        return response.json();
      });

      let data = { url };
      if (report?.lighthouseResult?.categories?.performance?.score) {
        data = {
          ...data,
          performance: Math.round(
            report?.lighthouseResult?.categories?.performance?.score * 100
          )
        };
      }
      if (report?.lighthouseResult?.categories?.accessibility?.score) {
        data = {
          ...data,
          accessibility: Math.round(
            report?.lighthouseResult?.categories?.accessibility?.score * 100
          )
        };
      }
      if (report?.lighthouseResult?.categories?.["best-practices"]?.score) {
        data = {
          ...data,
          best_practices: Math.round(
            report?.lighthouseResult?.categories?.["best-practices"]?.score *
              100
          )
        };
      }
      if (report?.lighthouseResult?.categories?.seo?.score) {
        data = {
          ...data,
          seo: Math.round(
            report?.lighthouseResult?.categories?.seo?.score * 100
          )
        };
      }
      return data;
    });

    return await Promise.all(promises);
  } catch (error) {
    console.log(error);
  }
}

export async function getPages(url, params) {
  try {
    const response = await fetch(`${url}wp-json/wp/v2/pages${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    const urls = data.map((page) => page?.link);

    return {
      totalPages: response?.headers.get("x-wp-totalpages"),
      urls
    };

    // return { response, urls };
  } catch (error) {
    console.error(error);
  }
}
