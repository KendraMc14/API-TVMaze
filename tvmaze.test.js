"use strict";

describe("getShowsByTerm", function () {
  it("should successfully search", async function () {
    const shows = await getShowsByTerm("bletchley");
    const ids = shows.map(s => s.id);
    expect(ids).toEqual([1767, 37008]);
  });

  it("should return nothing for bad search", async function () {
    const shows = await getShowsByTerm("squeamish ossifrage");
    expect(shows).toEqual([]);
  });
});

describe("getEpisodesOfShow", function () {

  it("should successfully search", async function () {
    const episodes = await getEpisodesOfShow(1767);
    expect(episodes.length).toEqual(7);
  });

  it("should handle missing shows", async function () {
    try {
      const episodes = await getEpisodesOfShow(0);
    } catch (err) {
      expect(err.message).toContain("404");
    }
  });
});

describe("getEpisodesOfShow [mocked]", function () {

  it("should successfully search", async function () {
    const mock = new AxiosMockAdapter(axios);
    mock.onGet(`${TVMAZE_API_URL}shows/1000/episodes`)
      .reply(200, [{ id: 1, name: "A", season: "B", number: 10 }]);

    const episodes = await getEpisodesOfShow(1000);
    expect(episodes).toEqual([{
      id: 1,
      name: "A",
      season: "B",
      number: 10,
    }]);

    mock.restore();
  });
});

describe("search form submission", function () {

  it("should search", async function () {
    spyOn(window, "searchForShowAndDisplay");

    $("#searchForm-term").val("bletchley");
    $searchForm.trigger("submit");

    expect(searchForShowAndDisplay).toHaveBeenCalledTimes(1);
  });
})

