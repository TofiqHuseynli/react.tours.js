import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { API_ROUTES, config } from "@config";
import { mailList, settings, translations } from "@actions";
import AppLib from "fogito-core-ui/build/library/App";
import {
  BottomNavigation,
  Content,
  Error,
  ErrorBoundary,
  Loading,
  Sidebar,
  Auth,
  Lang,
  Api,
} from "fogito-core-ui";
import { Inbox } from "../Inbox";
import { Connected } from "../Connected";

export const App = () => {
  const location = useLocation();
  const url = location.pathname.split("/")[1];
  const ifUser = url === "offer";
  const [loading, setLoading] = React.useState(true);
  const [menuRoutes, setMenuRoutes] = React.useState([]);

  const loadSettings = async (params) => {
    const response = await settings(params);
    if (response) {
      return {
        account_data: response.account_data,
        permissions: response.permissions,
        timezone: response.timezone,
        company: response.company,
      };
    }
  };

  const loadTranslations = async (params) => {
    const response = await translations(params);
    if (response) {
      return {
        lang: response.data?.lang,
        lang_data: response.data?.lang_data,
      };
    }
  };

  const loadMailList = async () => {
    let response = await mailList();
    if (response.status !== "success") {
      //give error
    }

    let nestedRotues = [{
          path: "/all",
          name: "Allinbox",
          isExact: false,
          component: (props) => <Inbox {...props} type="inbox" />,
        },];

    response.data.map((item) => {
      item.email.length &&
      nestedRotues.push({
        path: "/"+item?.value,
        name: item?.email,
        isExact: false,
        component: (props) => <Inbox {...props} mailId={item.value} />,
      });
    });

    let MENU_ROUTES = [
      {
        path: "/inbox",
        name: "Inbox",
        icon: <i className="symbol feather feather-mail text-danger" />,
        isExact: false,
        isHidden: false,
        nestedRoutes:  nestedRotues 
        
        // [
        //   {
        //     path: "/all",
        //     name: "Allinbox",
        //     isExact: false,
        //     component: (props) => <Inbox {...props} type="inbox" />,
        //   },
          
        //     ...response.data.map((item) => (
        //        {
        //         path: "/" + item?.value,
        //         name: item?.email,
        //         isExact: false,
        //         component: (props) => <Inbox {...props} mailId={item.value} />,
        //       }
        //     )),
          
        // ],
      },
      {
        path: "/connected",
        name: "Connected Email",
        icon: <i class="symbol feather feather-sliders text-warning"/>,
        isExact: false,
        isHidden: false,
        component : (props) => <Connected {...props} />


      }
    ];

    setMenuRoutes(MENU_ROUTES);
  };

  const loadData = async () => {
    const common = parent.window.common;
    if (common) {
      let { account_data, lang } = common;
      const translations = await loadTranslations({ lang: lang?.short_code });
      Auth.setData({ ...account_data });
      Lang.setData({ ...translations });
      await loadMailList();
      setLoading(false);
    } else {
      const settings = await loadSettings();
      const translations = await loadTranslations();
      Auth.setData({
        ...settings.account_data,
        permissions: settings.permissions,
        company: settings.company,
        timezone: settings.timezone,
      });
      Lang.setData({ ...translations });
      await loadMailList();
      setLoading(false);
    }
  };

  const renderRoutes = (routes) => {
    return routes.map((route, key) => (
      <Route
        exact={route.isExact}
        path={route.path}
        render={(props) =>
          route.nestedRoutes ? (
            <Switch>
              {route.nestedRoutes.map((item, key) => (
                <Route
                  exact={item.isExact}
                  path={route.path + item.path}
                  render={(props) =>
                    item.component({
                      ...props,
                      ...{ name: item.name },
                    })
                  }
                  key={key}
                />
              ))}
              <Redirect to={route.path + route.nestedRoutes[0].path} />
            </Switch>
          ) : (
            route.component({
              ...props,
              ...{ name: route.name },
            })
          )
        }
        key={key}
      />
    ));
  };

  window.onThemeChange = (theme) => {
    document.body.className = theme;
  };

  React.useEffect(() => {
    if (process.env.frameMode) {
      const path =
        process.env.publicPath.replace("/service", "") +
        location.pathname +
        location.search;
      if (parent.window?.historyPush) {
        parent.window.historyPush(path);
      } else {
        if (url !== "offer") {
          window.location.replace(path);
        }
      }
    }
  }, [location]);

  React.useEffect(() => {
    Api.setRoutes(API_ROUTES);
    Api.setParams({ app_id: config.appID, test: true });
    AppLib.setData({
      appName: config.appName,
    });
    loadData();
  }, []);

  if (loading) {
    return <Loading type="whole" />;
  }

  if (!Auth.isAuthorized() && url !== "inbox") {
    return <Error message={Lang.get("NotAuthorized")} />;
  }

  const routes = menuRoutes.filter((item) => {
    return item.id ? !!Auth.isPermitted(item.id, "view") : true;
  });

  return (
    <ErrorBoundary>
      <Sidebar {...{ routes }} />
      <Content>
        <Switch>
          {renderRoutes(routes)}
          <Redirect from="*" to="/inbox" />
        </Switch>
      </Content>
      <BottomNavigation {...{ routes }} />
    </ErrorBoundary>
  );
};
