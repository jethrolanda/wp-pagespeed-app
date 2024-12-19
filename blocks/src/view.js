/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from "@wordpress/interactivity";
import { getPages, getPosts, getCustomPostTypes, pageSpeed } from "./actions";
const { state, actions, callbacks } = store("pagespeed-app", {
  state: {
    performanceSorted: false,
    accessibilitySorted: false,
    bestPracticesSorted: false,
    seoSorted: false,
    get isNotEmpty() {
      return getContext().pagespeedResults.length > 0;
    },
    get isPerformanceSelected() {
      return getContext().category.includes("performance");
    },
    get isAccessibility() {
      return getContext().category.includes("accessibility");
    },
    get isBestPracticesSelected() {
      return getContext().category.includes("best-practices");
    },
    get isSeoSelected() {
      return getContext().category.includes("seo");
    },
    get getPageProgressPercentage() {
      const context = getContext();
      const progress = Math.round(
        (context.status.page.page / context.status.page.totalPages) * 100
      );
      return context.status.page.text == "Error!"
        ? `Error!`
        : `${progress < 5 ? "5" : progress}% complete!`;
    },
    get getPostProgressPercentage() {
      const context = getContext();
      const progress = Math.round(
        (context.status.post.page / context.status.post.totalPages) * 100
      );
      return context.status.post.text == "Error!"
        ? `Error!`
        : `${progress < 5 ? "5" : progress}% complete!`;
    },
    get getCptsProgressPercentage() {
      const context = getContext();
      const progress = Math.round(
        (context.status.cpts.page / context.status.cpts.totalPages) * 100
      );
      return context.status.cpts.text == "Error!"
        ? `Error!`
        : `${progress < 5 ? "5" : progress}% complete!`;
    }
  },
  actions: {
    submit: async () => {
      const context = getContext();
      context.pagespeedResults = [];
      console.log(context.post_types);
      if (callbacks.isUrlValid()) {
        context.bgcolor = "#fff";
        context.processing = true;
        context.submitBtnText = "Processing...";

        try {
          if (context.post_types.includes("page")) {
            await actions.generateReportPages(context);
          }
          if (context.post_types.includes("post")) {
            await actions.generateReportPosts(context);
          }
          if (context.post_types.includes("custom_post_type")) {
            actions.generateReportCustomPostTypes(context);
          }

          // while (!context.isDone) {
          //   console.log(context.isDone, context.page);
          //   const query = `?page=${context.page}`;
          //   const result = await getPages(context.url, query);
          //   context.totalPages = result?.totalPages;
          //   context.status = `Page ${context.page} out of ${context.totalPages}`;
          //   const params = `strategy=${
          //     context.device
          //   }&category=${context.category.join("&category=")}`;
          //   const scores = await pageSpeed(result?.urls, params);
          //   context.pagespeedResults = [...context.pagespeedResults, ...scores];

          //   console.log(context.pagespeedResults);
          //   if (context.page < parseInt(context.totalPages)) {
          //     context.page += 1;
          //   } else {
          //     context.isDone = true;
          //     context.status = "";
          //   }
          // }
        } catch (error) {
          console.log(error);
          alert("Error: Make sure the site is powered by wordpress");
        } finally {
          // context.processing = false;
          context.submitBtnText = "Submit";
          context.bgcolor = "";
        }
      } else {
        alert("Invalid URL");
      }
    },
    generateReportPages: async (context) => {
      try {
        context.status.page.processing = true;
        context.status.page.isDone = false;
        let isDone = context.status.page.isDone;
        let page = context.status.page.page;
        let counter = 0;
        while (!isDone) {
          const query = `?page=${page}`;
          const result = await getPages(context.url, query);
          counter += result?.urls.length;
          context.status.page.text = `Processing ${counter} out of ${result?.totalEntries}`;
          context.status.page.totalPages = result?.totalPages;
          context.status.page.totalEntries = result?.totalEntries;
          const params = `strategy=${
            context.device
          }&category=${context.category.join("&category=")}`;
          const scores = await pageSpeed(result?.urls, params);
          context.pagespeedResults = [...context.pagespeedResults, ...scores];

          console.log(context.pagespeedResults);
          if (page < parseInt(result?.totalPages)) {
            context.status.page.page += 1;
            page += 1;
          } else {
            isDone = true;
            context.status.page.isDone = true;
            context.status.page.processing = false;
            context.status.page.text = "Done!";
          }
        }
      } catch (error) {
        context.status.page.text = "Error!";
        context.status.page.processing = false;
      }
    },
    generateReportPosts: async (context) => {
      try {
        context.status.post.processing = true;
        context.status.post.isDone = false;
        let isDone = context.status.post.isDone;
        let page = context.status.post.page;
        let counter = 0;
        while (!isDone) {
          const query = `?page=${page}`;
          const result = await getPosts(context.url, query);
          counter += result?.urls.length;
          context.status.post.text = `${counter} out of ${result?.totalEntries}`;
          context.status.post.totalPages = result?.totalPages;
          context.status.post.totalEntries = result?.totalEntries;
          const params = `strategy=${
            context.device
          }&category=${context.category.join("&category=")}`;
          const scores = await pageSpeed(result?.urls, params);
          context.pagespeedResults = [...context.pagespeedResults, ...scores];

          console.log(context.pagespeedResults);
          if (page < parseInt(result?.totalPages)) {
            context.status.post.page += 1;
            page += 1;
          } else {
            isDone = true;
            context.status.post.isDone = true;
            context.status.post.processing = false;
            context.status.post.text = "Done!";
          }
        }
      } catch (error) {
        context.status.post.text = "Error!";
        context.status.post.processing = false;
      }
    },
    generateReportCustomPostTypes: async (context) => {
      try {
        context.status.cpts.processing = true;
        context.status.cpts.isDone = false;
        let isDone = context.status.cpts.isDone;
        let page = context.status.cpts.page;
        let counter = 0;
        while (!isDone) {
          const query = `?page=${page}`;
          const result = await getCustomPostTypes(context.url, query);
          counter += result?.urls.length;
          context.status.cpts.text = `${counter} out of ${result?.totalEntries}`;
          context.status.cpts.totalPages = result?.totalPages;
          context.status.cpts.totalEntries = result?.totalEntries;
          const params = `strategy=${
            context.device
          }&category=${context.category.join("&category=")}`;
          const scores = await pageSpeed(result?.urls, params);
          context.pagespeedResults = [...context.pagespeedResults, ...scores];

          console.log(context.pagespeedResults);
          if (page < parseInt(result?.totalPages)) {
            context.status.cpts.page += 1;
            page += 1;
          } else {
            isDone = true;
            context.status.cpts.isDone = true;
            context.status.cpts.processing = false;
            context.status.cpts.text = "Done!";
          }
        }
      } catch (error) {
        context.status.cpts.text = "Error!";
        context.status.cpts.processing = false;
      }
    }
  },
  callbacks: {
    setUrl: () => {
      const context = getContext();
      const { ref } = getElement();
      context.url = ref.value;
    },
    setOptions: () => {
      const context = getContext();
      const { post_types, category } = context;
      const { ref } = getElement();

      switch (ref.name) {
        case "device":
          context.device = ref.value;
          break;
        case "post_types":
          if (!post_types.includes(ref.value)) {
            context.post_types.push(ref.value);
          } else {
            context.post_types.splice(post_types.indexOf(ref.value), 1);
          }
          break;
        case "category":
          if (!category.includes(ref.value)) {
            context.category.push(ref.value);
          } else {
            context.category.splice(category.indexOf(ref.value), 1);
          }
          break;
        default:
          break;
      }
    },
    isUrlValid: () => {
      try {
        const context = getContext();
        const pattern = new RegExp(
          "^([a-zA-Z]+:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IP (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$", // fragment locator
          "i"
        );
        return pattern.test(context.url);
      } catch (error) {
        return false;
      }
    },
    getDomainNameFromUrl: () => {
      const context = getContext();
      const host = new URL(context.url).host;
      return host;
    },
    sortPerformance: () => {
      const context = getContext();
      context.pagespeedResults = context.pagespeedResults.sort((a, b) => {
        return state.performanceSorted
          ? b?.performance - a?.performance
          : a?.performance - b?.performance;
      });
      state.performanceSorted = !state.performanceSorted;
    },
    sortAccessibility: () => {
      const context = getContext();
      context.pagespeedResults = context.pagespeedResults.sort((a, b) => {
        return state.accessibilitySorted
          ? b?.accessibility - a?.accessibility
          : a?.accessibility - b?.accessibility;
      });
      state.accessibilitySorted = !state.accessibilitySorted;
    },
    sortBestPractices: () => {
      const context = getContext();
      context.pagespeedResults = context.pagespeedResults.sort((a, b) => {
        return state.bestPracticesSorted
          ? b?.best_practices - a?.best_practices
          : a?.best_practices - b?.best_practices;
      });
      state.bestPracticesSorted = !state.bestPracticesSorted;
    },
    sortSeo: () => {
      const context = getContext();
      context.pagespeedResults = context.pagespeedResults.sort((a, b) => {
        return state.seoSorted ? b?.seo - a?.seo : a?.seo - b?.seo;
      });
      state.seoSorted = !state.seoSorted;
    },
    downloadCSV: () => {
      const context = getContext();
      if (context.pagespeedResults.length <= 0)
        alert("Please generate a report first.");

      const titleKeys = Object.keys(context.pagespeedResults[0]);

      const refinedData = [];
      refinedData.push(titleKeys);

      context.pagespeedResults.forEach((item) => {
        refinedData.push(Object.values(item));
      });
      let csvContent = "";

      refinedData.forEach((row) => {
        csvContent += row.join(",") + "\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
      const objUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", objUrl);
      link.setAttribute(
        "download",
        `Pagespeed report for ${callbacks.getDomainNameFromUrl()} - ${new Date().toLocaleString()}.csv`
      );
      link.click();
    }
  }
});
