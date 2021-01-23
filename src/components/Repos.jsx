import React, { useContext } from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";

const Repos = () => {
  const { repos } = React.useContext(GithubContext);

  const languages = repos.reduce((accumulator, item) => {
    const { language, stargazers_count } = item;
    // note: stargazers_count is the property name for number of stars in repo in github's api!

    if (!language) return accumulator;
    if (!accumulator[language])
      accumulator[language] = {
        label: language,
        value: 1,
        stars: stargazers_count,
      };
    else
      accumulator[language] = {
        ...accumulator[language],
        value: accumulator[language].value + 1, // override value, you'll have 2 values, but the latter one overrides the previous one!
        stars: accumulator[language].stars + stargazers_count,
      };

    return accumulator;
  }, {});

  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  // most stars per language >
  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      return { ...item, value: item.stars }; // because my chart is looking for the "value" property!
    })
    .slice(0, 5);

  // stars and forks

  let { stars, forks } = repos.reduce(
    (accumulator, item) => {
      const { stargazers_count, name, forks } = item;
      accumulator.stars[stargazers_count] = {
        label: name,
        value: stargazers_count,
      };
      accumulator.forks[forks] = { label: name, value: forks };
      return accumulator;
    },
    {
      stars: {},
      forks: {},
    }
  );

  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
